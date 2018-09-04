import {Range} from "./Range";

export enum MatchType {
    ADDED = "ADDED",
    REMOVED = "REMOVED",
    MATCH = "MATCH",
    CHANGED = "CHANGED",
    MOVED = "MOVED",
    MOVED_FROM = "MOVED_FROM",
    MOVED_TO = "MOVED_TO"
}

export interface DiffRange {
    r1: Range;
    r2: Range;
    movedTo: Range;
    matchType: MatchType;
}