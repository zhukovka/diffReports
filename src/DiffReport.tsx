import * as React from "react";
import {DiffRange, MatchType} from "./model/DiffRange";
import DiffRangeComponent from "./components/ranges/DiffRangeComponent";
import {Video} from "./model/Video";
import Row from "./components/layout/Row";
import ThumbsStrip from "./model/ThumbsStrip";
import Col from "./components/layout/Col";
import "./style.css";
import List from "./components/layout/List";
import VideoComponent from "./components/video/VideoComponent";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
}

interface State {
    types: { [type: string]: boolean };
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
        this.state = {
            // @ts-ignore
            types : Object.assign({}, MatchType)
        };
    }

    componentDidMount () {
        console.log('Component Mount on Client Side...', this.props);
    }

    render () {
        const {ranges, comparedVideo, sourceVideo} = this.props;
        const {types} = this.state;
        const eventsCount = ranges.reduce((counts: any, range) => {
            if (!counts[range.matchType]) {
                counts[range.matchType] = 0;
            }
            counts[range.matchType] += 1;
            return counts;
        }, {});
        return (
            <div className={"DiffReport"}>
                <Row className={"DiffReport__header"} gap={"10px"}>
                    <Col>
                        <h1>
                            COMPARE REPORT
                        </h1>
                        <div>
                            Combined results
                        </div>
                    </Col>
                    <Col col={1}>
                        <Row gap={"10px"}>
                            <Col col={1} className={"text-end"}>
                                <p>
                                    File 1
                                </p>
                                <VideoComponent video={sourceVideo}/>
                            </Col>
                            <Col>
                                <p>
                                    COMPARED TO
                                </p>
                            </Col>
                            <Col col={1}>
                                <p>File 2</p>
                                <VideoComponent video={comparedVideo}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <div>
                                Compare events:
                            </div>
                            <List>
                                {Object.keys(MatchType).map(type => {
                                    return (
                                        <li key={type}>
                                            <input type="checkbox" id={type} value={type}
                                                   checked={!!types[type]}
                                                   onChange={e => this.toggleType(type)}/>
                                            <label htmlFor={type}>
                                                {type} ({eventsCount[type] || 0})
                                            </label>
                                        </li>
                                    )
                                })}
                            </List>
                        </Row>
                    </Col>
                </Row>
                <div className={"DiffReport__ranges"}>
                    {ranges.filter(r => !!types[r.matchType]).map((range, i) => (
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

    private toggleType (type: string) {
        // @ts-ignore
        const types = Object.assign({}, this.state.types);
        types[type] = !this.state.types[type];
        this.setState({types});
    }
}

export default DiffReport;