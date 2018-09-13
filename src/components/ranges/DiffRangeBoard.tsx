import {IRange} from "../../model/Range";
import * as React from "react";
import ThumbsStrip, {FrameStrip, Strip} from "../../model/ThumbsStrip";

interface Props {
    r1: IRange;
    r2: IRange;
    thumbsStrip: ThumbsStrip;
    cols?: number;

    getImage (frame: number, rangeNumber: number): Promise<HTMLImageElement>
}

const MAX_ROWS = 20;
const ROWS_GAP = 10;
const NAME = "DiffRangeBoard";

class DiffRangeBoard extends React.Component<Props, any> {

    static displayName = NAME;

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {r1, r2, thumbsStrip, cols} = this.props;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');

        let col = (cols || thumbsStrip.cols);
        let totalRows = Math.ceil(Math.max(r1.length, r2.length) / col) * 2;
        let renderRows = Math.min(MAX_ROWS, totalRows);

        const r1Rows = thumbsStrip.framesToCanvas(r1.frame, r1.length, cols || thumbsStrip.cols);
        const r2Rows = thumbsStrip.framesToCanvas(r2.frame, r2.length, cols || thumbsStrip.cols);
        this.stripsForRows(r1Rows.slice(0, renderRows), ctx, 0);
        this.stripsForRows(r2Rows.slice(0, renderRows), ctx, 1);
        //TODO: render rows > MAX_ROWS
    };

    private stripsForRows (rows: Map<FrameStrip, Strip>[], ctx: CanvasRenderingContext2D, rangeNumber: number = 0) {
        const {thumbsStrip} = this.props;
        let frameHeight = thumbsStrip.frameHeight;
        for (const strip of rows) {
            for (const [src, dest] of strip) {
                let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
                let {x : dX, width : dWidth, height : dHeight} = dest;
                let dY = dest.y * 2 + (rangeNumber * frameHeight) + (dest.y / frameHeight * ROWS_GAP);

                this.props.getImage(src.startFrame, rangeNumber).then(img => {
                    ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                });
            }
        }
    }

    render () {
        const {r1, r2, thumbsStrip, cols} = this.props;
        let col = (cols || thumbsStrip.cols);
        const width = col * thumbsStrip.frameWidth;
        let maxRangeRows = Math.ceil(Math.max(r1.length, r2.length) / col);
        let renderRows = Math.min(maxRangeRows, MAX_ROWS);
        const height = renderRows * 2 * thumbsStrip.frameHeight + ROWS_GAP * renderRows;

        return <div className={NAME}>
            <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={width} height={height}/>
        </div>
    }
}

export default DiffRangeBoard;