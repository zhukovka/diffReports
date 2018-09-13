import * as React from "react";
import ThumbsStrip, {FrameStrip, Strip} from "../../model/ThumbsStrip";
import {DiffRange} from "../../model/DiffRange";
import Row from "../layout/Row";

interface Props {
    range: DiffRange;
    thumbsStrip: ThumbsStrip;
    cols?: number;

    getImage (frame: number, rangeNumber: number): Promise<HTMLImageElement>
}


interface State {
    boards: number
}

const MAX_ROWS = 20;
const ROWS_GAP = 10;
const NAME = "DiffRangeBoard";

class DiffRangeBoard extends React.Component<Props, State> {

    static displayName = NAME;
    private r1Rows: Map<FrameStrip, Strip>[];
    private r2Rows: Map<FrameStrip, Strip>[];
    private totalBoards: number;

    constructor (props: Props) {
        super(props);
        this.state = {
            boards : 1
        };
        this.setRangeMaps(props);
    }

    componentWillReceiveProps (nextProps: Props) {
        this.setRangeMaps(nextProps);
    }


    private setRangeMaps (props: Props) {
        const {range, thumbsStrip, cols} = props;
        const {r1, r2} = range;
        let col = (cols || thumbsStrip.cols);
        let totalRows = Math.ceil(Math.max(r1.length, r2.length) / col);
        this.totalBoards = totalRows / MAX_ROWS;
        this.r1Rows = thumbsStrip.framesToCanvas(r1.frame, r1.length, col);
        this.r2Rows = thumbsStrip.framesToCanvas(r2.frame, r2.length, col);
    }

    setupCanvas = (canvas: HTMLCanvasElement, range1Map: Map<FrameStrip, Strip>[], range2Map: Map<FrameStrip, Strip>[], deltaY: number) => {
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');

        this.stripsForRows(range1Map, ctx, 0, deltaY);
        this.stripsForRows(range2Map, ctx, 1, deltaY);

    };

    private stripsForRows (rows: Map<FrameStrip, Strip>[], ctx: CanvasRenderingContext2D, rangeNumber: number = 0, deltaY: number) {
        const {thumbsStrip} = this.props;
        let frameHeight = thumbsStrip.frameHeight;
        for (const strip of rows) {
            for (const [src, dest] of strip) {
                let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
                let {x : dX, width : dWidth, height : dHeight} = dest;
                let dY = (dest.y * 2 + (rangeNumber * frameHeight) + (dest.y / frameHeight * ROWS_GAP)) - deltaY;

                this.props.getImage(src.startFrame, rangeNumber).then(img => {
                    ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                });
            }
        }
    }

    private renderBoards () {

        const {range, thumbsStrip, cols} = this.props;
        const {r1, r2} = range;
        let col = (cols || thumbsStrip.cols);
        const width = col * thumbsStrip.frameWidth;

        let maxRangeRows = Math.ceil(Math.max(r1.length, r2.length) / col);
        let totalHeight = 0;
        let totalRows = 0;
        return Array.from({length : this.state.boards}, (v, i) => {
            let renderRows = Math.min(maxRangeRows - totalRows, MAX_ROWS);

            const height = renderRows * 2 * thumbsStrip.frameHeight + ROWS_GAP * renderRows;
            let deltaY = totalHeight;

            let start = totalRows;
            let r1 = this.r1Rows.slice(start, start + renderRows);
            let r2 = this.r2Rows.slice(start, start + renderRows);

            totalHeight += height;
            totalRows += renderRows;

            return (<canvas className={`${NAME}__canvas`} key={`board-${i}`}
                            ref={el => this.setupCanvas(el, r1, r2, deltaY)}
                            width={width} height={height}/>);
        });
    }

    render () {
        let {boards} = this.state;

        return <div className={`${NAME} container`}>
            <div className={`${NAME}__boards`}>
                {this.renderBoards()}
                {boards < this.totalBoards ?
                    <Row justify={"center"}>
                        <button className={`${NAME}__load button`}
                                onClick={() => this.setState({boards : boards + 1})}>
                            Load next
                        </button>
                    </Row>
                    : null
                }
            </div>
        </div>
    }
}

export default DiffRangeBoard;