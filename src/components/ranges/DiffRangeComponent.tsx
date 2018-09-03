import {ReactElementProps} from "../../common/react-interfaces";
import {DiffRange} from "../../model/DiffRange";
import Row from "../layout/Row";
import * as React from "react";
import {Video} from "../../model/Video";
import ThumbsStripComponent from "../video/ThumbsStripComponent";
import ThumbsStrip from "../../model/ThumbsStrip";
import {RangeComponent} from "./RangeComponent";
import Col from "../layout/Col";

interface Props extends ReactElementProps {
    range: DiffRange;
    sourceVideo: Video;
    comparedVideo: Video;
    thumbsStrip: ThumbsStrip;
    getSrc: (page: number, video: Video) => string;
}

//fps*10 размером 120*68
const DiffRangeComponent = ({range, sourceVideo, comparedVideo, thumbsStrip, getSrc}: Props) => {
    const {r1, r2} = range;

    return (<Row>
        <div>
            <ThumbsStripComponent endFrame={r1.frame} startFrame={r1.frame}
                                  getSrc={page => getSrc(page, sourceVideo)}
                                  thumbsStrip={thumbsStrip}/>
            <ThumbsStripComponent endFrame={r2.frame} startFrame={r2.frame}
                                  getSrc={page => getSrc(page, comparedVideo)}
                                  thumbsStrip={thumbsStrip}/>
        </div>
        <Col col={1}>
            <ul>
                <li>
                    File 1
                    <RangeComponent range={r1}/>
                </li>

            </ul>
            <ul>
                <li>
                    File 2
                    <RangeComponent range={r2}/>
                </li>
            </ul>
            <div>
                Match type {range.matchType}
            </div>
        </Col>
        <Col col={3}>
            {r1.length} frames in File 1 were {range.matchType} with {r2.length} frames in File 2
        </Col>
        <div>
            DETAILS
        </div>
    </Row>)
};

export default DiffRangeComponent;