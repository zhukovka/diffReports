import {Range} from "./Range";

export interface Strip {
    x: number,
    y: number,
    width: number,
    height: number,
    frames: number
}

export interface FrameStrip extends Strip {
    startFrame: number;
}

class ThumbsStrip {
    constructor (public cols: number, public rows: number, public frameWidth: number, public frameHeight: number) {
    }

    pageForFrame (frameNumber: number): number {
        return (frameNumber / this.cols / this.rows) | 0;
    }

    framesToCanvas (startFrame: number, length: number, dCols: number): Map<FrameStrip, Strip>[] {
        let height = this.frameHeight;
        let frameWidth = this.frameWidth;
        let pageHeight = (height * this.rows);

        let sourceFrame = startFrame;
        let endFrame = startFrame + length;
        let rows: Map<FrameStrip, Strip>[] = [];
        let dRowsCount = Math.ceil(length / dCols);
        let dX = 0;
        let row;

        while (dRowsCount) {
            row = new Map();
            rows.push(row);

            let spaceInDestinationRow = dCols;
            let sourceCol = (sourceFrame % this.cols);

            let framesInSourceRow = Math.min(this.cols - sourceCol, length);

            let framesLeft = endFrame - sourceFrame;
            while (spaceInDestinationRow && framesLeft) {

                // frames to draw in destination
                const frames = Math.min(spaceInDestinationRow, framesInSourceRow, framesLeft);
                const width = frames * frameWidth;

                // row of current source frame in the source image
                let sourceRow = (sourceFrame / this.cols) | 0;
                let sY = (sourceRow * height) % pageHeight;
                let sX = sourceCol * frameWidth;
                let src = {x : sX, y : sY, width, height, frames, startFrame : sourceFrame};

                let dY = (rows.length - 1) * height;
                let dest = {x : dX, y : dY, width, height, frames};
                row.set(src, dest);

                spaceInDestinationRow = spaceInDestinationRow - frames;
                sourceFrame += frames;
                sourceCol = (sourceFrame % this.cols);
                framesInSourceRow = Math.min(this.cols - sourceCol, length);
                framesLeft = endFrame - sourceFrame;

                dX = (dX + frames * frameWidth) % (dCols * frameWidth);
            }
            dRowsCount--;
        }
        return rows;
    }
}

export default ThumbsStrip;