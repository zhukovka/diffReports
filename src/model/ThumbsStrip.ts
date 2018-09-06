export interface Strip {
    x: number,
    y: number,
    width: number,
    height: number,
    frames: number
}

class ThumbsStrip {
    constructor (public cols: number, public rows: number, public frameWidth: number, public frameHeight: number) {
    }

    pageForFrame (frameNumber: number): number {
        return (frameNumber / this.cols / this.rows) | 0;
    }

    stripsForFrames (from: number, to: number): { [page: number]: Strip[] } {
        const storyboard: { [page: string]: Strip[] } = {};
        let startRow = (from / this.cols) | 0;
        const lastRow = (to / this.cols + 1) | 0;
        for (let i = startRow; i < lastRow; i++) {
            let page = (i / this.rows) | 0;
            if (!storyboard[page]) {
                storyboard[page] = []
            }
            let startCol = (from % this.cols);
            let colsInThisRow = Math.min(this.cols - startCol, to - from + 1);

            const x = startCol * this.frameWidth;
            const y = (i * this.frameHeight) % (this.frameHeight * this.rows);

            const width = colsInThisRow * this.frameWidth;

            storyboard[page].push({x, width, y, height : this.frameHeight, frames : colsInThisRow});
            from += colsInThisRow;
        }
        return storyboard;
    }

    stripsToCanvas (strips: Strip[], offset: { x: number, y: number }): Map<Strip, Strip[]> {
        let stripsMap = new Map();
        let offsetFrames = (offset.x / this.frameWidth) % this.cols;
        let x = offsetFrames * this.frameWidth;
        let plusRow = (offset.x / this.frameWidth / this.cols) | 0;
        let offsetY = offset.y + plusRow * this.frameHeight;
        let rowNumber = 0;
        let framesDrawn = 0;
        for (const strip of strips) {
            let row = [];

            let rows = Math.ceil((strip.frames + offsetFrames) / this.cols);

            let i = 0;
            let framesToDraw = strip.frames;

            while (i < rows) {
                let room = this.cols - offsetFrames;
                let frames = Math.min(room, framesToDraw);
                let y = offsetY + (this.frameHeight * rowNumber);
                let width = this.frameWidth * frames;
                row.push({x, y, width, height : this.frameHeight, frames});

                framesDrawn += frames;
                rowNumber = framesDrawn / this.cols | 0;
                framesToDraw -= frames;
                offsetFrames = frames % this.cols;
                x = (x + width) % (this.cols * this.frameWidth);
                i++;
            }
            stripsMap.set(strip, row);
        }
        return stripsMap;
    }


    stripsMapToRows (sourceStrips: Strip[], cols: number): Map<Strip, Strip>[] {
        let rows: Map<Strip, Strip>[] = [];
        //we have sourceStrips to map to rows of n cols
        let frameHeight = this.frameHeight;
        let frameWidth = this.frameWidth;
        let room = cols;
        let offset = 0;
        let row;
        let height = frameHeight;
        let dX = 0;
        for (const sourceStrip of sourceStrips) {
            let framesInStrip = sourceStrip.frames;
            const rowsInStrip = ((framesInStrip + offset) / cols | 0) + 1;

            let {x : sX, y : sY, width : sW} = sourceStrip;
            let r = 0;
            while (r < rowsInStrip) {
                //new destination row
                if (!offset) {
                    row = new Map();
                    rows.push(row);
                }
                const framesToDraw = Math.min(room, framesInStrip);
                let width = framesToDraw * frameWidth;

                let src = {x : sX, y : sY, width, height, frames : framesToDraw};

                let dY = (rows.length - 1) * height;
                let dest = {x : dX, y : dY, width, height, frames : framesToDraw};

                row.set(src, dest);

                sX += framesToDraw * frameWidth;
                dX = (dX + framesToDraw * frameWidth) % cols;

                framesInStrip -= framesToDraw;

                room = room - framesToDraw || cols;

                offset = (offset + framesToDraw) % cols;

                r++;
            }
        }
        return rows;
    }
}

export default ThumbsStrip;