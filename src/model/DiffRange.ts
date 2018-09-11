import {IRange} from "./Range";

export enum MatchType {
    ADDED = "ADDED",
    REMOVED = "REMOVED",
    MATCH = "MATCH",
    CHANGED = "CHANGED",
    MOVED = "MOVED",
    MOVED_FROM = "MOVED_FROM",
    MOVED_TO = "MOVED_TO"
}
export enum MatchTypeColors {
    ADDED = "green",
    REMOVED = "red",
    MATCH = "blue",
    CHANGED = "yellow",
    MOVED = "orange",
    MOVED_FROM = "orange",
    MOVED_TO = "orange"
}

export interface DiffRange {
    r1: IRange;
    r2: IRange;
    movedTo: IRange;
    matchType: MatchType;
}