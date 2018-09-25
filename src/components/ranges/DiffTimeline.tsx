import * as React from "react";
import {ChangeEvent, MouseEvent, WheelEvent} from "react";
import {Video} from "bigfootjs/dist/Video";
import ThumbsStrip, {Coordinates} from "bigfootjs/dist/ThumbsStrip";
import {DiffRange, MatchTypeColors} from "bigfootJS/dist/DiffRange";
import {IRange} from "bigfootJS/dist/Range";

const NAME = "DiffTimeline";
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;
const COLS = 10;

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
    selectedRange?: DiffRange;

    getImage (videoId: string, page: number): Promise<HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap>

    rangeSelected (range: DiffRange): void
}


interface State {
    zoom: number;
    pointerX: number;
    maxZoom: number;
}

class DiffTimeline extends React.Component<Props, State> {
    private readonly thumbsStrip: ThumbsStrip;
    private dFrameWidth: number;
    private dFrameHeight: number;
    private totalFrameCount: number;
    private canvas: HTMLCanvasElement;
    private timelineMap: Map<DiffRange, IRange>;
    private container: HTMLDivElement;
    private drawCount: number;

    constructor (props: Props) {
        super(props);
        const {ranges, sourceVideo, comparedVideo} = props;
        if (sourceVideo) {
            this.dFrameWidth = FRAME_WIDTH / 2;
            this.dFrameHeight = FRAME_HEIGHT / 2;
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
            this.thumbsStrip.setDestFrameSize({frameWidth : this.dFrameWidth, frameHeight : this.dFrameHeight});
            this.totalFrameCount = ranges.reduce((acc, range) => {
                let {r1, r2} = range;
                return acc + Math.max(r1.length, r2.length);
            }, 0);
            this.timelineMap = this.thumbsStrip.diffRangesTimeline(ranges);
            this.drawCount = 0;
        }
        this.state = {
            zoom : 1,
            pointerX : 0,
            maxZoom : 0
        };
    }

    componentWillReceiveProps (nextProps: Props) {
        let selectedRange = nextProps.selectedRange;
        if (this.container && selectedRange) {
            let pointerX = this.pointerXFromRange(selectedRange);
            this.setState({pointerX}, () => {
                this.scrollToPointer(pointerX);
            });
        }
    }

    get pxPerFrame () {
        if (!this.canvas || !this.totalFrameCount) {
            return 0;
        }
        return this.canvas.width / this.totalFrameCount;
    }

    setupContainer = (container: HTMLDivElement) => {
        this.container = container;
        if (!container || !this.totalFrameCount || !container.clientWidth) {
            return;
        }

        const maxZoom = Math.min(this.totalFrameCount * this.dFrameWidth, 32767) / container.clientWidth | 0;
        let pointerX = this.pointerXFromRange(this.props.selectedRange);
        this.setState({maxZoom, pointerX});
    };

    pointerXFromRange (selectedRange: DiffRange) {
        let selected = this.timelineMap.get(selectedRange);
        if (selected) {
            let {frame, length} = selected;
            let {pointerX} = this.state;
            let startX = frame * this.pxPerFrame;
            let endX = (frame + length) * this.pxPerFrame;
            if (startX < pointerX && pointerX < endX) {
                return pointerX;
            } else {
                return startX;
            }
        }
        return 0;
    }

    setupCanvas = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas;
        if (!canvas) {
            return;
        }
        this.drawCount++;
        canvas.width = canvas.parentElement.clientWidth;
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let pxPerFrame = this.pxPerFrame;
        this.thumbsStrip.timelineDrawer(this.timelineMap, pxPerFrame, this.drawTimeline);
    };

    drawTimeline = (diffRange: DiffRange, frameNumber: number, src: Coordinates, dest: Coordinates) => {
        if (!this.canvas) {
            return;
        }
        const ctx = this.canvas.getContext('2d');
        let {r1, r2, matchType} = diffRange;
        let drawCount = this.drawCount;
        let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
        let {x : dX, y : dY, width : dWidth, height : dHeight} = dest;
        ctx.fillStyle = MatchTypeColors[matchType];
        ctx.fillRect(sX, sY, sWidth, sHeight);
        ctx.fillRect(dX, dY, dWidth, dHeight);
    };

    onZoom = (e: ChangeEvent<HTMLInputElement>) => {
        let zoom = +e.target.value;
        let pointerX = this.state.pointerX / this.state.zoom * zoom;
        this.setState({zoom, pointerX}, () => {
            this.setupCanvas(this.canvas);
            this.scrollToPointer(this.state.pointerX);
        });
    };

    onRangeClick = (e: MouseEvent) => {
        let {offsetX : pointerX} = e.nativeEvent;
        let timelineEntry = this.rangeAtPointer(pointerX);
        this.setState({pointerX}, () => {
            this.props.rangeSelected(timelineEntry[0]);
        });
    };

    rangeAtPointer (pointerX: number) {
        let timelineFrame = pointerX / this.pxPerFrame | 0;
        return this.thumbsStrip.entryByFrame(this.timelineMap, timelineFrame);
    }

    scrollToPointer (pointerX: number) {
        if (!this.container) {
            return;
        }
        this.container.scrollTo(pointerX - this.container.clientWidth / 2, 0);
    }

    onWheel = (e: WheelEvent) => {
        if (this.container && e.deltaY != 0) {
            this.container.scrollTo(this.container.scrollLeft + e.deltaY, 0);
        }
    };

    render () {
        const {zoom, pointerX, maxZoom} = this.state;
        const height = this.dFrameHeight * 2;
        let style = {'--timeline-zoom' : zoom};
        // @ts-ignore
        return <div className={NAME} style={style}>
            <div className={"container overflow-x"} ref={this.setupContainer} onWheel={this.onWheel}>
                <div className={`${NAME}__ranges`} onClick={this.onRangeClick}>
                    <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={1200}
                            height={height}/>
                    <div className={`${NAME}__pointer`} style={{left : `${pointerX}px`}}/>
                </div>
            </div>
            {(maxZoom >= zoom) ?
                <div className={`${NAME}__zoom`}>
                    <input type="range" max={maxZoom} min={1} step={0.5} onChange={this.onZoom} value={zoom}/>
                </div>
                : null
            }
        </div>
    }
}

export default DiffTimeline;

