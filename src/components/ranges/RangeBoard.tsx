import * as React from "react";
import ThumbsStrip, {FrameStrip, Strip} from "bigfootjs/dist/ThumbsStrip";
import {IRange} from "bigfootjs/dist/Range";
import {MatchTypeColors} from "bigfootjs/dist/DiffRange";
import {Coordinates} from "bigfootjs/src/ThumbsStrip";

interface Props {
    range: IRange;
    thumbsStrip: ThumbsStrip;
    cols?: number;

    getImage (frame: number): Promise<HTMLImageElement>
}

const NAME = "RangeBoard";

export function RangeBoard ({range, thumbsStrip, cols, getImage}: Props) {
    let col = (cols || thumbsStrip.cols);
    const width = col * thumbsStrip.frameWidth;
    const rows = Math.min(3, range.length / col | 0);
    const height = rows * thumbsStrip.frameHeight;

    function setupCanvas (canvas: HTMLCanvasElement) {
        if (!canvas) {
            return;
        }

        const dstRange = {frame : 0, length : Math.min(range.length, 3 * col)};

        function drawRange (frameNumber: number, src: Coordinates, dest: Coordinates) {
            const ctx = canvas.getContext('2d');
            let {x : sX, y : sY, width : sWidth, height : sHeight} = src;
            let {x : dX, y, width : dWidth, height : dHeight} = dest;
            getImage(frameNumber).then(img => {
                let dY = (dX / width | 0) * thumbsStrip.frameHeight;
                ctx.drawImage(img, sX, sY, width, sHeight, dX % width, dY, width, dHeight);
            });
        }

        thumbsStrip.drawRange(range, dstRange, thumbsStrip.frameWidth, 0, drawRange)
    }

    return (<canvas className={`${NAME}__canvas`}
                    ref={el => setupCanvas(el)}
                    width={width} height={height}/>);
}

// @ts-ignore
RangeBoard.displayName = NAME;