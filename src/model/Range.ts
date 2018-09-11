export interface IRange {
    frame: number;
    length: number;
}

export class Range implements IRange {
    frame: number;
    length: number;

    constructor (frame: number, length: number) {
        this.frame = frame;
        this.length = length;
    }

    static fromIRange ({frame, length}: IRange): Range {
        return new Range(frame, length);
    }

    // overlaps (r: Range) {
    //     return !this.isEmpty() && !r.isEmpty() && (this.containsFrame(r.frame) || r.containsFrame(this.frame));
    // }

}

export function containsFrame (range: IRange, frameNumber: number): boolean {
    return this.length != 0 && (frameNumber >= range.frame && frameNumber + 1 <= range.frame + range.length);
}
