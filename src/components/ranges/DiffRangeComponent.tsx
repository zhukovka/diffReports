import {ReactElementProps} from "../../common/react-interfaces";
import {DiffRange, MatchType} from "../../model/DiffRange";
import {IRange} from "../../model/Range";
import Row from "../layout/Row";
import * as React from "react";
import {Video} from "../../model/Video";
import ThumbsStripComponent from "../video/ThumbsStripComponent";
import ThumbsStrip, {FrameStrip, Strip} from "../../model/ThumbsStrip";
import {RangeComponent} from "./RangeComponent";
import Col from "../layout/Col";
import "./range.css";
import {classNameFrom} from "../../utils/CSSUtils";
import Placeholder from "../layout/Placeholder";
import {LayoutMode} from "../../common/LayoutMode";
import DiffRangeBoard from "./DiffRangeBoard";

interface Props extends ReactElementProps {
    range: DiffRange;
    sourceVideo: Video;
    comparedVideo: Video;
    thumbsStrip: ThumbsStrip;

    getImage (videoId: string, page: number): Promise<HTMLImageElement>

    layout: LayoutMode;
    cols?: number;

    onClick? (componentElement: HTMLElement): void;
}

function matchTypeDescription (range: DiffRange): string {
    const {r1, r2, matchType} = range;
    //{r1.length} frames in File 1 were {range.matchType} with {r2.length} frames in File 2
    switch (matchType) {
        case MatchType.REMOVED:
            return `${r1.length} frames from File 1 were ${matchType} (do not exist) in File 2`;
        case MatchType.MOVED_TO:
            return `${r2.length} frames from File 2 starting from frame ${r2.frame} were ${matchType} File 1 starting from frame ${r1.frame}`;
        case MatchType.MOVED_FROM:
            return `${r1.length} frames from File 1 starting from frame ${r1.frame} were ${matchType} File 2 starting from frame ${r2.frame}`;
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
const DiffRangeComponent = ({range, sourceVideo, comparedVideo, thumbsStrip, getImage, className, layout, onClick, cols}: Props) => {
    let {r1, r2, matchType, movedTo} = range;
    if (matchType == MatchType.MOVED_FROM) {
        r2 = movedTo;
    } else if (matchType == MatchType.MOVED_TO) {
        r1 = movedTo;
    }
    const {frameWidth, frameHeight} = thumbsStrip;
    let dCols = cols || 10;
    let _el: HTMLElement;
    let getThumbsStripComponent = function (range: IRange, length: number, rangeNumber: number) {
        let rows: Map<FrameStrip, Strip>[] = thumbsStrip.framesToCanvas(range.frame, length, dCols);
        let width = frameWidth * Math.min(length, dCols);
        return <ThumbsStripComponent strips={rows}
                                     width={width}
                                     height={frameHeight * rows.length}
                                     getImage={frame => {
                                         return _getImage(frame, rangeNumber);
                                     }}/>;
    };

    const _getImage = (frame: number, rangeNumber: number) => {
        let page = thumbsStrip.pageForFrame(frame);
        return getImage(rangeNumber == 0 ? sourceVideo.id : comparedVideo.id, page);
    };

    function renderRangeFrames () {
        return <DiffRangeBoard getImage={_getImage} range={range} thumbsStrip={thumbsStrip} cols={dCols}/>
    }

    return (
        <div className={`${NAME} ${classNameFrom(className)}`} ref={el => _el = el}>
            <Row align={"center"}>
                <Col className={`matchType-${matchType.toLowerCase()}`}>
                    {r1.length ? getThumbsStripComponent(r1, 1, 0)
                        : <Placeholder height={`${thumbsStrip.frameHeight}px`} width={`${thumbsStrip.frameWidth}px`}/>
                    }
                    {r2.length ? getThumbsStripComponent(r2, 1, 1)
                        : <Placeholder height={`${thumbsStrip.frameHeight}px`} width={`${thumbsStrip.frameWidth}px`}/>
                    }
                </Col>
                <Row direction={"col"} alignSelf={"stretch"}>
                    <Col col={1}>
                        <div>
                            File 1
                        </div>
                        <RangeComponent range={r1}/>
                    </Col>
                    <Col col={1}>
                        <div>File 2</div>
                        <RangeComponent range={r2}/>
                    </Col>
                    <Col>
                        <div>
                            Match type: {matchType}
                        </div>
                    </Col>
                </Row>
                <Col col={3}>
                    <Row justify={"center"} className={"matchType__description"}>
                        {matchTypeDescription(range)}
                    </Row>
                </Col>
                <Col>
                    <Row direction={"col"}>
                        {layout == LayoutMode.DETAILED &&
                        <textarea name="notes" id="" cols={30} rows={10}
                                  placeholder="User defined description / Notes:"/>
                        }
                        <button onClick={() => onClick(_el)} className={`${NAME}__details button`}>
                            {layout == LayoutMode.DETAILED ? "HIDE DETAILS" : "DETAILS"}
                        </button>
                    </Row>
                </Col>
            </Row>
            {layout == LayoutMode.DETAILED &&
            <Row>
                {renderRangeFrames()}
            </Row>
            }
        </div>
    )
};
// @ts-ignore
DiffRangeComponent.displayName = NAME;
export default DiffRangeComponent;