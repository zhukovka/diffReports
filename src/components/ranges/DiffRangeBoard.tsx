import {Range} from "../../model/Range";
import * as React from "react";
import ThumbsStrip, {FrameStrip, Strip} from "../../model/ThumbsStrip";

interface Props {
    r1: Range;
    r2: Range;
    getSrc: (frame: number, rangeNumber: number) => string;
    thumbsStrip: ThumbsStrip;
    cols?: number;
}

const MAX_ROWS = 20;

class DiffRangeBoard extends React.Component<Props, any> {
    private imageMap: Map<string, HTMLImageElement> = new Map();

    static displayName = "DiffRangeBoard";

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {r1, r2, thumbsStrip, getSrc, cols} = this.props;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');

        let col = (cols || thumbsStrip.cols);
        let totalRows = Math.ceil(Math.max(r1.length, r2.length) / col) * 2;
        let renderRows = Math.min(MAX_ROWS, totalRows);

        const r1Rows = thumbsStrip.framesToCanvas(r1.frame, r1.length, cols || thumbsStrip.cols);
        const r2Rows = thumbsStrip.framesToCanvas(r2.frame, r2.length, cols || thumbsStrip.cols);

        this.stripsForRows(r1Rows, ctx, 0);
        this.stripsForRows(r2Rows, ctx, 1);
    };

    private stripsForRows (rows: Map<FrameStrip, Strip>[], ctx: CanvasRenderingContext2D, rangeNumber: number = 0) {
        const {thumbsStrip, getSrc} = this.props;
        for (const strip of rows) {
            for (const [src, dest] of strip) {
                let imgSrc = getSrc(src.startFrame, rangeNumber);
                let img: HTMLImageElement;
                if (this.imageMap.has(imgSrc)) {
                    img = this.imageMap.get(imgSrc);
                } else {
                    img = new Image();
                    img.src = imgSrc;
                    img.onload = () => {
                        let dstY = dest.y * 2 + (rangeNumber * thumbsStrip.frameHeight);
                        ctx.drawImage(img, src.x, src.y, src.width, src.height, dest.x, dstY, dest.width, dest.height);
                        this.imageMap.set(img.src, img);
                    };
                }
            }
        }
    }

    private drawStrip (src: FrameStrip, dest: Strip, ctx: CanvasRenderingContext2D, imgSrc: string) {
    }

    render () {
        const {r1, r2, thumbsStrip, cols} = this.props;
        let col = (cols || thumbsStrip.cols);
        const width = col * thumbsStrip.frameWidth;
        let totalRows = Math.ceil(Math.max(r1.length, r2.length) / col) * 2;
        const height = Math.min(totalRows, MAX_ROWS) * thumbsStrip.frameHeight;

        return <div className={"DiffRangeBoard"}>
            <canvas ref={this.setupCanvas} width={width} height={height}/>
        </div>
    }
}

export default DiffRangeBoard;