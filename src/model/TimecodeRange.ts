import {DiffRange, MatchType} from "./DiffRange";
import TapeTimecode from "./TapeTimecode";
import {getTimecodeRange} from "./Range";

export interface TimecodeRange {
    start: string;
    end: string;
}

export class TimecodeDiffRange {
    public r1: TimecodeRange;
    public r2: TimecodeRange;
    public matchType: MatchType;


    constructor (r1: TimecodeRange, r2: TimecodeRange, matchType: MatchType) {
        this.r1 = r1;
        this.r2 = r2;
        this.matchType = matchType;
    }

    public static toTimecode (range: DiffRange, tc1: TapeTimecode, tc2: TapeTimecode): TimecodeDiffRange {
        let tcr1: TimecodeRange = null;
        let tcr2: TimecodeRange = null;
        let {r1, r2, movedTo, matchType} = range;

        switch (matchType) {
            case MatchType.MOVED_TO:
                r1 = movedTo;
                break;
            case MatchType.MOVED_FROM:
                r2 = movedTo;
                break;
        }

        if (r1.length) {
            tcr1 = getTimecodeRange(r1, tc1);
        }
        if (r2.length) {
            tcr2 = getTimecodeRange(r2, tc2);
        }
        return new TimecodeDiffRange(tcr1, tcr2, matchType);
    }
}
