import * as React from "react";
import {ChangeEvent} from "react";
import {DiffRange, MatchTypeColors} from "../../model/DiffRange";
import ThumbsStrip, {Coordinates} from "../../model/ThumbsStrip";
import {Video} from "../../model/Video";
import {Range} from "../../model/Range";

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
}

class DiffTimeline extends React.Component<Props, State> {
    private readonly thumbsStrip: ThumbsStrip;
    private dFrameWidth: number;
    private dFrameHeight: number;
    private totalFrameCount: number;
    private canvas: HTMLCanvasElement;

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
        }
        this.state = {
            zoom : 1
        };
    }

    setupCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) {
            return;
        }
        const {ranges, sourceVideo, comparedVideo} = this.props;
        this.canvas = canvas;
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;
        const ctx = canvas.getContext('2d');
        let interval = Math.ceil(this.totalFrameCount * this.dFrameWidth / containerWidth);
        let framesDrawn = 0;
        let pxPerFrame = containerWidth / this.totalFrameCount;
        for (const range of ranges) {
            let {r1, r2, matchType} = range;
            ctx.fillStyle = MatchTypeColors[matchType];
            let dX = framesDrawn * pxPerFrame;
            this.drawRangeTimeline(r1, sourceVideo.id, pxPerFrame, ctx, dX, 0, interval);
            this.drawRangeTimeline(r2, comparedVideo.id, pxPerFrame, ctx, dX, this.dFrameHeight, interval);
            framesDrawn += Math.max(r1.length, r2.length);
        }

    };

    private drawRangeTimeline (r: Range, videoId: string, pxPerFrame: number, ctx: CanvasRenderingContext2D, dX: number, dY: number, interval: number) {
        let {length, frame} = r;
        let pxForRange = length * pxPerFrame;
        let dstFrames = pxForRange / this.dFrameWidth;
        ctx.fillRect(dX, dY, pxForRange, this.dFrameHeight);
        while (length > 0) {
            let {x, y, height, width} = this.thumbsStrip.frameCoordinates(frame);
            let page = this.thumbsStrip.pageForFrame(frame);

            let dstW = Math.min(this.dFrameWidth, dstFrames * this.dFrameWidth);
            let src = {
                x, y, height, width : Math.min(width, dstFrames * width)
            };
            let dest = {
                x : dX, y : dY, height : this.dFrameHeight, width : dstW
            };
            this.props.getImage(videoId, page).then(img => this.drawFrame(ctx, src, dest, img));

            frame += interval;
            length -= interval;
            dX += dstW;
            dstFrames--;
        }
    }

    drawFrame (ctx: CanvasRenderingContext2D, src: Coordinates, dest: Coordinates, img: HTMLImageElement) {
        let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
        let {x : dX, y : dY, width : dWidth, height : dHeight} = dest;
        ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
    }

    onZoom = (e: ChangeEvent) => {
        let zoom = +(e.target as HTMLInputElement).value;
        this.setState({zoom}, () => {
            this.setupCanvas(this.canvas);
        });
    };

    render () {
        const {zoom} = this.state;
        const height = this.dFrameHeight * 2;
        const width = 1200;
        let style = {'--timeline-zoom' : zoom};
        // @ts-ignore
        return <div className={NAME} style={style}>
            <div className={`${NAME}__ranges`}>
                <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={width} height={height}/>
            </div>
            <div className={`${NAME}__zoom`}>
                <input type="range" max={10} min={1} step={0.5} onChange={this.onZoom} value={zoom}/>
            </div>
        </div>
    }
}

export default DiffTimeline;

