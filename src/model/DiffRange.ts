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
    ADDED = "darkcyan",
    REMOVED = "red",
    MATCH = "darkblue",
    CHANGED = "darkgreen",
    MOVED = "orange",
    MOVED_FROM = "fuchsia",
    MOVED_TO = "mediumseagreen"
}

export interface DiffRange {
    r1: IRange;
    r2: IRange;
    movedTo: IRange;
    matchType: MatchType;
}