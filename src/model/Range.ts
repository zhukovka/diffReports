import {TimecodeRange} from "./TimecodeRange";
import TapeTimecode from "./TapeTimecode";

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

export function getTimecodeRange (range: IRange, timecode: TapeTimecode): TimecodeRange {
    if (range.length) {
        let startFrame = range.frame;
        let endFrame = range.frame + range.length - 1;
        return {start : timecode.getTimecodeAtFrame(startFrame), end : timecode.getTimecodeAtFrame(endFrame)};
    }
    return null;
}

export function containsFrame (range: IRange, frameNumber: number): boolean {
    return this.length != 0 && (frameNumber >= range.frame && frameNumber + 1 <= range.frame + range.length);
}
