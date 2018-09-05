import {ReactElementProps} from "../../common/react-interfaces";
import {DiffRange, MatchType} from "../../model/DiffRange";
import Row from "../layout/Row";
import * as React from "react";
import {Video} from "../../model/Video";
import ThumbsStripComponent from "../video/ThumbsStripComponent";
import ThumbsStrip from "../../model/ThumbsStrip";
import {RangeComponent} from "./RangeComponent";
import Col from "../layout/Col";
import "./range.css";
import {classNameFrom} from "../../utils/CSSUtils";
import Placeholder from "../layout/Placeholder";
import {LayoutMode} from "../../common/LayoutMode";

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
            return `${r2.length} frames from File 2 starting from frame ${r2.frame} were ${matchType} to File 1 starting from frame ${r1.frame}`;
    }
    return `${r1.length} frames in File 1 were ${matchType} with ${r2.length} frames in File 2`;
}

function renderThumbs (range: DiffRange, sourceVideo: Video, comparedVideo: Video, thumbsStrip: ThumbsStrip, getSrc: (page: number, video: Video) => string) {
    const {r1, r2, matchType} = range;

    return (<ThumbsStripComponent endFrame={r1.frame + r1.length - 1} startFrame={r1.frame}
                                  getSrc={page => getSrc(page, sourceVideo)}
                                  thumbsStrip={thumbsStrip}/>)
}

//fps*10 размером 120*68
const DiffRangeComponent = ({range, sourceVideo, comparedVideo, thumbsStrip, getSrc, className, layout, onClick}: Props) => {
    const {r1, r2, matchType} = range;

    return (
        <div className={`DiffRangeComponent ${classNameFrom(className)}`}>
            <Row align={"center"}>
                <Col className={`matchType-${matchType.toLowerCase()}`}>
                    {r1.length ? <ThumbsStripComponent endFrame={r1.frame} startFrame={r1.frame}
                                                       getSrc={page => getSrc(page, sourceVideo)}
                                                       thumbsStrip={thumbsStrip}/>
                        : <Placeholder height={`${thumbsStrip.frameHeight}px`} width={`${thumbsStrip.frameWidth}px`}/>
                    }
                    {r2.length ? <ThumbsStripComponent endFrame={r2.frame} startFrame={r2.frame}
                                                       getSrc={page => getSrc(page, comparedVideo)}
                                                       thumbsStrip={thumbsStrip}/>
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
                {renderThumbs(range, sourceVideo, comparedVideo, thumbsStrip, getSrc)}
            </Row>
            }
        </div>
    )
};

export default DiffRangeComponent;