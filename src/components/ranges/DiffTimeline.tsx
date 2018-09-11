import * as React from "react";
import {ChangeEvent, MouseEvent} from "react";
import {DiffRange, MatchTypeColors} from "../../model/DiffRange";
import ThumbsStrip, {Coordinates} from "../../model/ThumbsStrip";
import {Video} from "../../model/Video";
import {IRange} from "../../model/Range";

const NAME = "DiffTimeline";
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;
const COLS = 10;

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;

    getImage (videoId: string, page: number): Promise<HTMLImageElement>

    rangeSelected (range: DiffRange): void
}


interface State {
    zoom: number;
    pointerX: number;
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
            this.timelineMap = this.thumbsStrip.diffRangesToTimeline(ranges);
            this.drawCount = 0;
        }
        this.state = {
            zoom : 1,
            pointerX : 0
        };
    }

    get pxPerFrame () {
        if (!this.canvas || !this.totalFrameCount) {
            return 0;
        }
        return this.canvas.width / this.totalFrameCount;
    }

    get canvasWidth () {
        if (!this.canvas) {
            return 0;
        }
        return this.canvas.width;
    }

    setupCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) {
            return;
        }
        const {ranges, sourceVideo, comparedVideo} = this.props;
        this.drawCount++;

        this.canvas = canvas;
        canvas.width = canvas.parentElement.clientWidth;
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let pxPerFrame = this.pxPerFrame;
        for (const [diffRange, range] of this.timelineMap) {
            let {r1, r2, matchType} = diffRange;

            ctx.fillStyle = MatchTypeColors[matchType];

            this.drawRange(r1, range, sourceVideo.id, pxPerFrame, ctx, 0);
            this.drawRange(r2, range, comparedVideo.id, pxPerFrame, ctx, this.dFrameHeight);
        }
    };

    private drawRange (srcRange: IRange, dstRange: IRange, videoId: string, pxPerFrame: number, ctx: CanvasRenderingContext2D, dY: number) {
        let {frame : srcFrame, length : srcLength} = srcRange;
        let {frame : dstFrame, length : dstLength} = dstRange;

        let dX = dstFrame * pxPerFrame;
        let dstWidth = dstLength * pxPerFrame;
        let dstFrames = dstWidth / this.dFrameWidth;
        let drawCount = this.drawCount;
        ctx.fillRect(dX, dY, dstWidth, this.dFrameHeight);
        if (!srcLength) {
            return;
        }
        let interval = Math.max(Math.round(dstLength / dstFrames), 1);

        while (dstFrames > 0) {
            let {x, y, height, width} = this.thumbsStrip.frameCoordinates(srcFrame);
            let page = this.thumbsStrip.pageForFrame(srcFrame);

            let dstW = Math.min(this.dFrameWidth, dstFrames * this.dFrameWidth);
            let sWidth = Math.min(width, dstFrames * width);
            let src = {
                x, y, height, width : sWidth
            };
            let dest = {
                x : dX, y : dY, height : this.dFrameHeight, width : dstW
            };
            this.props.getImage(videoId, page).then(img => {
                if (drawCount == this.drawCount) {
                    this.drawFrame(ctx, src, dest, img);
                }
            });

            srcFrame += interval;
            dX += dstW;
            dstFrames--;
        }

    }

    drawFrame (ctx: CanvasRenderingContext2D, src: Coordinates, dest: Coordinates, img: HTMLImageElement) {
        let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
        let {x : dX, y : dY, width : dWidth, height : dHeight} = dest;
        ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
    }

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
        this.setState({pointerX});
        this.rangeAtPointer(pointerX);
    };

    rangeAtPointer (pointerX: number) {
        let timelineFrame = pointerX / this.pxPerFrame | 0;
        let timelineEntry = this.thumbsStrip.entryByFrame(this.timelineMap, timelineFrame);
        this.props.rangeSelected(timelineEntry[0]);
    }

    scrollToPointer (pointerX: number) {
        if (!this.container) {
            return;
        }
        this.container.scrollTo(pointerX - this.container.clientWidth / 2, 0);
    }

    render () {
        const {zoom, pointerX} = this.state;
        const height = this.dFrameHeight * 2;
        let style = {'--timeline-zoom' : zoom};
        // @ts-ignore
        return <div className={NAME} style={style}>
            <div className={"container"} ref={el => this.container = el}>
                <div className={`${NAME}__ranges`} onClick={this.onRangeClick}>
                    <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={this.canvasWidth}
                            height={height}/>
                    <div className={`${NAME}__pointer`} style={{left : `${pointerX}px`}}/>
                </div>
            </div>
            <div className={`${NAME}__zoom`}>
                <input type="range" max={10} min={1} step={0.5} onChange={this.onZoom} value={zoom}/>
            </div>
        </div>
    }
}

export default DiffTimeline;

