interface Coords {
    x: number,
    y: number,
    width: number,
    height: number
}

class ThumbsStrip {
    constructor (private cols: number, private rows: number, private width: number, private height: number) {
    }

    coordsForFrames (from: number, to: number): Coords[] {
        const coords: Coords[] = [];
        let startRow = (from / this.cols) | 0;
        const lastRow = (to / this.cols + 1) | 0;
        for (let i = startRow; i < lastRow; i++) {
            let boardNumber = (i / this.rows) | 0;
            let startCol = (from % this.cols);
            let colsInThisRow = Math.min(this.cols - startCol, to - from + 1);

            const x = startCol * this.width;
            const y = (i * this.height) % (this.height * this.rows);

            const width = colsInThisRow * this.width;

            coords.push({x, width, y, height : this.height});
            from += colsInThisRow;
        }
        return coords;
    }


}

export default ThumbsStrip;