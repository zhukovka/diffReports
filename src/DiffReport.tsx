import * as React from "react";
import {DiffRange, MatchType} from "./model/DiffRange";
import DiffRangeComponent from "./components/ranges/DiffRangeComponent";
import {Video} from "./model/Video";
import Row from "./components/layout/Row";
import ThumbsStrip from "./model/ThumbsStrip";
import Col from "./components/layout/Col";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
}

interface State {
}

const COLS = 10;
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;

class DiffReport extends React.Component<Props, State> {
    private readonly thumbsStrip: ThumbsStrip;

    constructor (props: Props) {
        super(props);
        if (props.sourceVideo) {
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
        }
    }

    componentDidMount () {
        console.log('Component Mount on Client Side...', this.props);
    }

    render () {
        const {ranges, comparedVideo, sourceVideo} = this.props;
        const eventsCount = ranges.reduce((counts: any, range) => {
            if (!counts[range.matchType]) {
                counts[range.matchType] = 0;
            }
            counts[range.matchType] += 1;
            return counts;
        }, {});
        return (
            <div>
                <Row>
                    <div>
                        COMPARE REPORT
                    </div>
                    <Col col={2}>
                        COMPARED TO
                    </Col>
                </Row>
                <Row>
                    <Col col={1}>
                        File 1
                        {sourceVideo.id}
                    </Col>
                    <Col col={1}>
                        File 2
                        {comparedVideo.id}
                    </Col>
                    <div>
                        Compare events:
                        <ul>
                            {Object.keys(MatchType).map(type => {
                                return (
                                    <li key={type}>
                                        {type} ({eventsCount[type] || 0})
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Row>
                <div>
                    {ranges.map((range, i) => (
                        <DiffRangeComponent key={i} range={range} comparedVideo={comparedVideo}
                                            sourceVideo={sourceVideo} getSrc={this.getSrc}
                                            thumbsStrip={this.thumbsStrip}/>))}
                </div>
            </div>)
    }

    private getSrc (page: number, video: Video) {
        // @ts-ignore
        let padStart = String(page + 1).padStart(3, '0');
        return `/projects/storage/${video.id}/stripes/square/out${padStart}.jpg`;
    }
}

export default DiffReport;