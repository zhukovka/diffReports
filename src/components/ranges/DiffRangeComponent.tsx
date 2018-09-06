import {ReactElementProps} from "../../common/react-interfaces";
import {DiffRange, MatchType} from "../../model/DiffRange";
import {Range} from "../../model/Range";
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
import {flatten} from "../../utils/ArrayUtils";

interface Props extends ReactElementProps {
    range: DiffRange;
    sourceVideo: Video;
    comparedVideo: Video;
    thumbsStrip: ThumbsStrip;
    getSrc: (page: number, video: Video) => string;
    layout: LayoutMode;
    onClick?: (range: DiffRange) => void;
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

const DiffRangeComponent = ({range, sourceVideo, comparedVideo, thumbsStrip, getSrc, className, layout, onClick}: Props) => {
    const {r1, r2, matchType} = range;
    const {frameWidth, frameHeight} = thumbsStrip;
    let dCols = 10;
    let getThumbsStripComponent = function (range: Range, length: number, sourceVideo: Video) {
        let rows: Map<FrameStrip, Strip>[] = thumbsStrip.framesToCanvas(range.frame, length, dCols);
        return rows.map((strip: Map<FrameStrip, Strip>, i) => {
            return <ThumbsStripComponent key={i} strip={strip}
                                         width={frameWidth * length}
                                         height={frameHeight}
                                         getSrc={frame => {
                                             let page = thumbsStrip.pageForFrame(frame);
                                             return getSrc(page, sourceVideo);
                                         }}/>;
        })
    };

    function renderThumbs () {
        let rows: Map<FrameStrip, Strip>[] = thumbsStrip.framesToCanvas(r1.frame, length, dCols);
        let width = frameWidth * dCols;
        rows.map((row, i) => {
            return (<div>

            </div>);
        });
    }

    return (
        <div className={`DiffRangeComponent ${classNameFrom(className)}`}>
            <Row align={"center"}>
                <Col className={`matchType-${matchType.toLowerCase()}`}>
                    {r1.length ? getThumbsStripComponent(r1, 1, sourceVideo)
                        : <Placeholder height={`${thumbsStrip.frameHeight}px`} width={`${thumbsStrip.frameWidth}px`}/>
                    }
                    {r2.length ? getThumbsStripComponent(r2, 1, comparedVideo)
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
                    {layout == LayoutMode.BASIC ?
                        <button onClick={() => onClick(range)}>
                            DETAILS
                        </button> :
                        <textarea name="notes" id="" cols={30} rows={10}
                                  placeholder="User defined description / Notes:"/>
                    }
                </Col>
            </Row>
            {layout == LayoutMode.DETAILED &&
            <Row>
                {renderThumbs()}
            </Row>
            }
        </div>
    )
};

export default DiffRangeComponent;