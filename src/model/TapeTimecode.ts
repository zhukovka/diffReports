class TapeTimecode {
    private dropFrame: boolean;
    private startTimecode: number;
    private tapeFps: number;

    constructor (dropFrame: boolean, startTimecode: number, fps: number) {
        this.dropFrame = dropFrame;
        this.startTimecode = startTimecode;
        this.tapeFps = fps;
    }

    private static timecodeToString (frameNumber: number, dropFrame: boolean, timecodeRate: number): string {
        if (dropFrame) {
            const D = (frameNumber / 17982) | 0;
            const M = frameNumber % 17982;
            frameNumber += 18 * D + 2 * ((M - 2) / 1798 | 0);
        }

        const frames = frameNumber % timecodeRate;
        frameNumber = (frameNumber / timecodeRate) | 0;
        const seconds = frameNumber % 60;
        frameNumber = (frameNumber / 60) | 0;
        const minutes = frameNumber % 60;
        frameNumber = (frameNumber / 60) | 0;
        const hours = frameNumber % 24;
        let tcfmt = "";
        tcfmt += `${hours}`.padStart(2, '0') + ':';
        tcfmt += `${minutes}`.padStart(2, '0') + ':';
        tcfmt += `${seconds}`.padStart(2, '0');
        tcfmt += (dropFrame ? ';' : '.');
        tcfmt += `${frames}`.padStart(2, '0');
        return tcfmt;
    }

    public getTimecodeAtFrame (frame: number): string {
        return TapeTimecode.timecodeToString(this.startTimecode + frame, this.dropFrame, this.tapeFps);
    }
}

export default TapeTimecode;