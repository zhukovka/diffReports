import {Range} from "./Range";

export interface Coordinates {
    x: number,
    y: number,
    width: number,
    height: number
}

export interface Strip extends Coordinates {
    frames: number
}

export interface FrameStrip extends Strip {
    startFrame: number;
}

class ThumbsStrip {
    private destFrameSize: { frameWidth: number, frameHeight: number };

    constructor (public cols: number, public rows: number, public frameWidth: number, public frameHeight: number) {
        this.destFrameSize = {
            frameHeight,
            frameWidth
        };
    }

    pageForFrame (frameNumber: number): number {
        return (frameNumber / this.cols / this.rows) | 0;
    }

    setDestFrameSize (dest: { frameWidth: number, frameHeight: number }) {
        this.destFrameSize = dest;
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

                let dY = (rows.length - 1) * this.destFrameSize.frameHeight;
                let dest = {
                    x : dX,
                    y : dY,
                    width : frames * this.destFrameSize.frameWidth,
                    height : this.destFrameSize.frameHeight,
                    frames
                };
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