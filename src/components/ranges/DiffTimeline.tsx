import * as React from "react";
import {ChangeEvent} from "react";
import {DiffRange, MatchTypeColors} from "../../model/DiffRange";
import ThumbsStrip, {Coordinates} from "../../model/ThumbsStrip";
import {Video} from "../../model/Video";
import {Range} from "../../model/Range";
import {MouseEvent} from "react";

const NAME = "DiffTimeline";
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;
const COLS = 10;

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;

    getImage (videoId: string, page: number): Promise<HTMLImageElement>
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
    private timelineMap: Map<DiffRange, Range>;

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

    setupCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) {
            return;
        }
        const {ranges, sourceVideo, comparedVideo} = this.props;
        this.canvas = canvas;
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;

        const ctx = this.canvas.getContext('2d');
        let pxPerFrame = this.pxPerFrame;
        for (const [diffRange, range] of this.timelineMap) {
            let {r1, r2, matchType} = diffRange;

            ctx.fillStyle = MatchTypeColors[matchType];

            this.drawRange(r1, range, sourceVideo.id, pxPerFrame, ctx, 0);
            this.drawRange(r2, range, comparedVideo.id, pxPerFrame, ctx, this.dFrameHeight);

        }
    };

    private drawRange (srcRange: Range, dstRange: Range, videoId: string, pxPerFrame: number, ctx: CanvasRenderingContext2D, dY: number) {
        let {frame : srcFrame, length : srcLength} = srcRange;
        let {frame : dstFrame, length : dstLength} = dstRange;

        let dX = dstFrame * pxPerFrame;
        let dstWidth = dstLength * pxPerFrame;
        let dstFrames = dstWidth / this.dFrameWidth;

        ctx.fillRect(dX, dY, dstWidth, this.dFrameHeight);
        if (!srcLength) {
            return;
        }
        let interval = Math.max((srcLength / dstFrames | 0), 1);

        while (srcLength > 0) {
            let {x, y, height, width} = this.thumbsStrip.frameCoordinates(srcFrame);
            let page = this.thumbsStrip.pageForFrame(srcFrame);

            let dstW = Math.min(this.dFrameWidth, dstFrames * this.dFrameWidth);
            let src = {
                x, y, height, width : Math.min(width, dstFrames * width)
            };
            let dest = {
                x : dX, y : dY, height : this.dFrameHeight, width : dstW
            };
            this.props.getImage(videoId, page).then(img => this.drawFrame(ctx, src, dest, img));

            srcFrame += interval;
            srcLength -= interval;
            dX += dstW;
            dstLength--;
        }

    }

    drawFrame (ctx: CanvasRenderingContext2D, src: Coordinates, dest: Coordinates, img: HTMLImageElement) {
        let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
        let {x : dX, y : dY, width : dWidth, height : dHeight} = dest;
        ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
    }

    onZoom = (e: ChangeEvent<HTMLInputElement>) => {
        let zoom = +e.target.value;
        this.setState({zoom}, () => {
            this.setupCanvas(this.canvas);
        });
    };

    onRangeClick = (e: MouseEvent) => {
        let {offsetX : pointerX} = e.nativeEvent;
        this.setState({pointerX});
    };

    render () {
        const {zoom, pointerX} = this.state;
        const height = this.dFrameHeight * 2;
        const width = 1200;
        let style = {'--timeline-zoom' : zoom};
        // @ts-ignore
        return <div className={NAME} style={style}>
            <div className={"container"}>
                <div className={`${NAME}__ranges`} onClick={this.onRangeClick}>
                    <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={width} height={height}/>
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

