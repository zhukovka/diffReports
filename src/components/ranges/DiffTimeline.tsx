import * as React from "react";
import {DiffRange, MatchType, MatchTypeColors} from "../../model/DiffRange";
import ThumbsStrip, {FrameStrip, Coordinates} from "../../model/ThumbsStrip";
import {Video} from "../../model/Video";
import {Range} from "../../model/Range";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
}

const NAME = "DiffTimeline";
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;
const COLS = 10;

class DiffTimeline extends React.Component<Props, any> {
    private imageMap: Map<string, HTMLImageElement> = new Map();
    private readonly thumbsStrip: ThumbsStrip;
    private dFrameWidth: number;
    private dFrameHeight: number;

    constructor (props: Props) {
        super(props);
        if (props.sourceVideo) {
            this.dFrameWidth = FRAME_WIDTH / 2;
            this.dFrameHeight = FRAME_HEIGHT / 2;
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
            this.thumbsStrip.setDestFrameSize({frameWidth : this.dFrameWidth, frameHeight : this.dFrameHeight});
        }
        this.state = {};
    }

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {ranges, sourceVideo, comparedVideo} = this.props;
        if (!canvas) {
            return;
        }
        const totalFrames = ranges.reduce((acc, range) => {
            let {r1, r2} = range;
            return acc + Math.max(r1.length, r2.length);
        }, 0);
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;
        const ctx = canvas.getContext('2d');
        let interval = Math.ceil(totalFrames * this.dFrameWidth / containerWidth);
        let framesDrawn = 0;
        let pxPerFrame = containerWidth / totalFrames;
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

            let imgSrc = this.getSrc(page, videoId);
            let dstW = Math.min(this.dFrameWidth, dstFrames * this.dFrameWidth);
            let src = {
                x, y, height, width : Math.min(width, dstFrames * width)
            };
            let dest = {
                x : dX, y : dY, height : this.dFrameHeight, width : dstW
            };
            this.drawFrame(ctx, src, dest, imgSrc);
            frame += interval;
            length -= interval;
            dX += dstW;
            dstFrames--;
        }
    }

    drawFrame (ctx: CanvasRenderingContext2D, src: Coordinates, dest: Coordinates, imgSrc: string) {
        let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
        let {x : dX, y : dY, width : dWidth, height : dHeight} = dest;
        let img: HTMLImageElement;
        if (this.imageMap.has(imgSrc)) {
            img = this.imageMap.get(imgSrc);
            ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        } else {
            img = new Image();
            img.src = imgSrc;
            img.onload = () => {
                ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                this.imageMap.set(img.src, img);
            };
        }

    }


    getSrc = (page: number, videoId: string) => {
        let padStart = String(page + 1).padStart(3, '0');
        return `${videoId}/stripes/out${padStart}.jpg`;
    };

    render () {
        const {ranges} = this.props;
        const height = this.thumbsStrip.frameHeight * 2;
        const width = 1200;
        return <div className={NAME}>
            <div>
                <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={width} height={height}/>
            </div>
        </div>
    }
}

export default DiffTimeline;

