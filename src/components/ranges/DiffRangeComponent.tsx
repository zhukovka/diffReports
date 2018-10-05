import {ReactElementProps} from "../../common/react-interfaces";
import * as React from "react";
import ThumbsStripComponent from "../video/ThumbsStripComponent";
import "./range.css";
import "./DiffRangeComponent.css";
import {classNameFrom} from "../../utils/CSSUtils";
import Placeholder from "../layout/Placeholder";
import {LayoutMode, ViewMode} from "../../common/LayoutMode";
import DiffRangeBoard from "./DiffRangeBoard";
import {DiffRange, MatchType} from "bigfootjs/dist/DiffRange";
import {IVideo} from "bigfootjs/dist/Video";
import ThumbsStrip, {FrameStrip, Strip} from "bigfootjs/dist/ThumbsStrip";
import TapeTimecode from "bigfootjs/dist/TapeTimecode";
import {TimecodeDiffRange} from "bigfootjs/dist/TimecodeRange";
import {IRange} from "bigfootjs/dist/Range";
import {TimecodeRange} from "bigfootjs/src/TimecodeRange";
import {MouseEvent} from "react";
import {RangeBoard} from "./RangeBoard";

interface Props extends ReactElementProps {
    range: DiffRange;
    sourceVideo: IVideo;
    comparedVideo: IVideo;
    thumbsStrip: ThumbsStrip;

    getImage (videoId: string, page: number): Promise<HTMLImageElement>

    layout: LayoutMode;
    view: ViewMode;
    cols?: number;

    onClick? (componentElement: HTMLElement): void;
}

function matchTypeDescription (range: DiffRange): string {
    const {r1, r2, matchType, movedTo} = range;
    //{r1.length} frames in File 1 were {range.matchType} with {r2.length} frames in File 2
    switch (matchType) {
        case MatchType.REMOVED:
            return `${r1.length} frames from File 1 were ${matchType} (do not exist) in File 2`;
        case MatchType.MOVED_TO:
            return `${r2.length} frames from File 2 starting from frame ${r2.frame} were ${matchType} File 1 starting from frame ${movedTo.frame}`;
        case MatchType.MOVED_FROM:
            return `${r1.length} frames from File 1 starting from frame ${r1.frame} were ${matchType} File 2 starting from frame ${movedTo.frame}`;
        case MatchType.MATCH:
            return `${r1.length} frames from File 1 starting from frame ${r1.frame} ${matchType} to ${r2.length} frames from File 2 starting from frame ${r2.frame}`;
        case MatchType.CHANGED:
            return `${r1.length} frames from File 1 starting from frame ${r1.frame} were ${matchType}/REPLACED with an additional ${r2.length} frames from File 2 starting from frame ${r2.frame}`;
        case MatchType.ADDED:
            return `${r2.length} frames were ${matchType} to File 2 starting from frame ${r2.frame}`;
    }
    return `${r1.length} frames in File 1 were ${matchType} with ${r2.length} frames in File 2`;
}

const NAME = "DiffRangeComponent";
const DiffRangeComponent = ({range, sourceVideo, comparedVideo, thumbsStrip, getImage, className, layout, onClick, cols, view}: Props) => {
    let {r1, r2, matchType, movedTo} = range;
    if (matchType == MatchType.MOVED_FROM) {
        r2 = movedTo;
    } else if (matchType == MatchType.MOVED_TO) {
        r1 = movedTo;
    }
    const {frameWidth, frameHeight} = thumbsStrip;
    let dCols = cols || 10;
    let _el: HTMLElement;
    let tc1 = new TapeTimecode(sourceVideo.isDropFrame, sourceVideo.startTimecode, sourceVideo.timecodeRate);
    let tc2 = new TapeTimecode(comparedVideo.isDropFrame, comparedVideo.startTimecode, comparedVideo.timecodeRate);
    let tcRange: TimecodeDiffRange = TimecodeDiffRange.toTimecode(range, tc1, tc2);
    let getThumbsStripComponent = function (startFrame: number, length: number, rangeNumber: number) {
        let rows: Map<FrameStrip, Strip>[] = thumbsStrip.framesToCanvas(startFrame, length, dCols);
        let width = frameWidth * Math.min(length, dCols);
        return <ThumbsStripComponent strips={rows}
                                     width={width}
                                     height={frameHeight * rows.length}
                                     getImage={(f) => _getImage(f, rangeNumber)}/>;
    };

    const _getImage = (frame: number, rangeNumber: number) => {
        let page = thumbsStrip.pageForFrame(frame);
        return getImage(rangeNumber == 0 ? sourceVideo.id : comparedVideo.id, page);
    };

    function renderRangeFrames () {
        return <DiffRangeBoard getImage={_getImage} range={range} thumbsStrip={thumbsStrip} cols={dCols}/>
    }

    function renderThumbs (r: IRange, rangeNumber: number) {
        const cols = dCols / 2 | 0;
        const prev = r.frame - cols;
        const next = r.frame + r.length;
        const total = rangeNumber === 0 ? sourceVideo.framesTotal : comparedVideo.framesTotal;
        return <div className={`${NAME}__thumbs`}>
            {prev >= 0 && getThumbsStripComponent(prev, cols, rangeNumber)}
            <RangeBoard range={r} getImage={(f) => _getImage(f, rangeNumber)} thumbsStrip={thumbsStrip}
                        cols={cols}/>
            {next < total && getThumbsStripComponent(next, cols, rangeNumber)}
        </div>;
    }

    function renderRange (r: IRange, tcr: TimecodeRange, rangeNumber: number) {
        return <div className={`${NAME}__range-${rangeNumber}`}>
            <div className={`${NAME}__frame-start`}>
                {r.frame}
            </div>
            <div className={`${NAME}__frame-end`}>
                {r.frame + r.length}
            </div>
            <div className={`${NAME}__thumb`}>
                {r.length ? getThumbsStripComponent(r.frame, 1, rangeNumber)
                    :
                    <Placeholder height={`${thumbsStrip.frameHeight}px`} width={`${thumbsStrip.frameWidth}px`}/>
                }
            </div>
            <div className={`${NAME}__match-type`}>
                {matchType}
            </div>
            <div className={`${NAME}__description`}>

            </div>
            <div className={`${NAME}__timecode-start`}>
                {!!tcr && <b>{tcr.start}</b>}
            </div>
            <div className={`${NAME}__timecode-end`}>
                {!!tcr && <b>{tcr.end}</b>}
            </div>
            {view == ViewMode.DETAILED && renderThumbs(r, rangeNumber)}
        </div>
    }

    function rangeClick (e: MouseEvent) {
        if (_el) {
            onClick(_el)
        }
    }

    return (<div
        className={`${NAME} ${NAME}-${matchType.toLowerCase()} layout-${LayoutMode[layout].toLowerCase()} ${classNameFrom(className)}`}
        ref={el => _el = el}
        onClick={rangeClick}>
        {matchType != MatchType.ADDED ? renderRange(r1, tcRange.r1, 0) : <div className={`${NAME}__placeholder`}></div>}
        {matchType != MatchType.REMOVED ? renderRange(r2, tcRange.r2, 1) :
            <div className={`${NAME}__placeholder`}></div>}
    </div>);
};
// @ts-ignore
DiffRangeComponent.displayName = NAME;
export default DiffRangeComponent;