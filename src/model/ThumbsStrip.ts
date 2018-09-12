import {containsFrame, IRange} from "./Range";
import {DiffRange} from "./DiffRange";

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

function findRange (frameNumber: number, entries: [DiffRange, IRange][]): [DiffRange, IRange] {
    if (!entries.length) {
        return null;
    }
    if (entries.length == 1) {
        return entries[0];
    }
    let mid = entries.length / 2 | 0;
    let range = entries[mid][1];

    if (containsFrame(range, frameNumber)) {
        return entries[mid];
    }

    if (range.frame > frameNumber) {
        let left = entries.slice(0, mid);
        return findRange(frameNumber, left);
    } else {
        let right = entries.slice(mid);
        return findRange(frameNumber, right);
    }
    return null;
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

    frameCoordinates (frameNumber: number): Coordinates {
        let height = this.frameHeight;
        let width = this.frameWidth;
        let pageHeight = (height * this.rows);
        let frameCol = (frameNumber % this.cols);
        // row of a frame in the source image
        let frameRow = (frameNumber / this.cols) | 0;
        let y = (frameRow * height) % pageHeight;
        let x = frameCol * width;
        return {x, y, height, width};
    }

    diffRangesToTimeline (ranges: DiffRange[]): Map<DiffRange, IRange> {
        let timelineRanges = new Map();
        let frame = 0;
        for (const diffRange of ranges) {
            let {r1, r2} = diffRange;
            let length = Math.max(r1.length, r2.length);
            let range = {frame, length};
            timelineRanges.set(diffRange, range);
            frame += length;
        }
        return timelineRanges;
    }

    /**
     * Find Timeline entry by frame number
     * @param timeline
     * @param timelineFrame
     */
    entryByFrame (timeline: Map<DiffRange, IRange>, timelineFrame: number): [DiffRange, IRange] {
        return findRange(timelineFrame, [...timeline.entries()]);
    }

    /**
     * source range frame numbers scaled to a canvas,
     * i.e. spread 42 frames from the source images to 10 frames space on the canvas
     * @param srcLength
     * @param dstLength
     */
    scaledToCanvas (srcLength: number, dstLength: number) {
        let step = srcLength / dstLength | 0;
        let frames = new Array(dstLength);
        return frames.fill(0).map((_, i) => {
            return i * step;
        });
    }

    framesToCanvas (startFrame: number, length: number, dCols: number): Map<FrameStrip, Strip>[] {
        let frameWidth = this.frameWidth;

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

                let sourceFrameCoordinates = this.frameCoordinates(sourceFrame);
                let src = {
                    ...sourceFrameCoordinates,
                    width : frames * frameWidth,
                    frames,
                    startFrame : sourceFrame
                };

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