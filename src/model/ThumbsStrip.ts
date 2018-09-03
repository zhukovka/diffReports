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

    stripsForFrames (from: number, to: number): { [page: number]: Strip[] } {
        const coords: { [page: string]: Strip[] } = {};
        let startRow = (from / this.cols) | 0;
        const lastRow = (to / this.cols + 1) | 0;
        for (let i = startRow; i < lastRow; i++) {
            let page = (i / this.rows) | 0;
            if (!coords[page]) {
                coords[page] = []
            }
            let startCol = (from % this.cols);
            let colsInThisRow = Math.min(this.cols - startCol, to - from + 1);

            const x = startCol * this.frameWidth;
            const y = (i * this.frameHeight) % (this.frameHeight * this.rows);

            const width = colsInThisRow * this.frameWidth;

            coords[page].push({x, width, y, height : this.frameHeight, frames : colsInThisRow});
            from += colsInThisRow;
        }
        return coords;
    }


}

export default ThumbsStrip;