import {DiffRange} from "bigfootjs/dist/DiffRange";
import {Video} from "bigfootjs/dist/Video";

export enum MessageType {
    INITIAL, CONTEXT, QUERY
}

export interface DiffMessage {
    type: MessageType
}

export interface InitialMessage extends DiffMessage {
    ranges: DiffRange[],
    comparedVideo: Video,
    sourceVideo: Video,
    projectId: string
}

export interface QueryMessage {
    query: string
}

export interface DiffResponse {
    type: MessageType,
    result?: any,
    error?: Error
}

export interface QueryResponse extends DiffResponse{
    query: string,
}