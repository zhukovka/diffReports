export interface Project {
    id: string;

    // The Upyachka Returns
    name: string;

    masterId: string;
    scanIds: string[];

    // status:ProjectStatus ;

    created: Date;

    // matches:Array<MomentsPair> ;

    notSeenByOperator: boolean;

    processingStarted: Date;

    //msec
    humanTime: number;
    ingestTime: number;
    diffTime: number;

    //last modified
    mtime: number;

    owner: string;
}