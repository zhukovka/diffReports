import {Range} from "./Range";

export enum MatchType {
    ADDED, REMOVED, MATCH, CHANGED, MOVED, MOVED_FROM, MOVED_TO
}

export interface DiffRange {
    r1: Range;
    r2: Range;
    movedTo: Range;
    matchType: MatchType;
}