import TapeTimecode from "./TapeTimecode";

export interface IVideo {
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

class Video implements IVideo {
    chunksTotal: number;
    chunksUploaded: number;
    clipName: string;
    filename: string;
    frameDuration: number;
    framesTotal: number;
    height: number;
    id: string;
    isDropFrame: boolean;
    isIndexed: boolean;
    needsFPSChange: boolean;
    reel: string;
    startTimecode: number;
    timecodeRate: number;
    timescale: number;
    uiVideoUrl: string;
    uploadedChunks: number[];
    width: number;

    public getTimecode () {
        return new TapeTimecode(this.isDropFrame, this.startTimecode, this.timecodeRate);
    }

}