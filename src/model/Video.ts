export interface Video {
    id: string;

    // original filename e.g. dnw_424242.mov
    filename: string;

    // calculated in runtime
    // uploading, uploaded
    // TODO: interface UploadStatus
    // status: UploadStatus;

    // calculated in runtime
    chunksUploaded: number;
    // calculated in runtime
    uploadedChunks: number[];

    chunksTotal: number;

    framesTotal: number;
    timescale: number;
    frameDuration: number;
    startTimecode: number;
    timecodeRate: number;
    isDropFrame: boolean;

    // prores, dpx
    //TODO: interface VideoFormat
    // originalType: VideoFormat;

    needsFPSChange: boolean;

    uiVideoUrl: string;

    // is video fully indexed
    isIndexed: boolean;

    width: number;

    height: number;

    reel: string;
    clipName: string;
}