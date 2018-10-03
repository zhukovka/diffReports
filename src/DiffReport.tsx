import * as React from "react";
import DiffRangeComponent from "./components/ranges/DiffRangeComponent";
import Row from "./components/layout/Row";
import Col from "./components/layout/Col";
import "./style.css";
import List from "./components/layout/List";
import VideoComponent from "./components/video/VideoComponent";
import {LayoutMode, ViewMode} from "./common/LayoutMode";
import DiffTimeline from "./components/ranges/DiffTimeline";
import {DiffRange, MatchType} from "bigfootjs/dist/DiffRange";
import {IVideo} from "bigfootjs/dist/Video";
import ThumbsStrip from "bigfootjs/dist/ThumbsStrip";

interface Props {
    ranges: DiffRange[];
    sourceVideo: IVideo;
    comparedVideo: IVideo;
    eventTypes: string[];
    getImage (videoId: string, page: number): Promise<HTMLImageElement>
}

interface State {
    excludedTypes: { [type: string]: boolean };
    range: DiffRange;
    shortEvents: boolean;
    minFrames: number;
}

const COLS = 10;
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;

class DiffReport extends React.Component<Props, State> {
    static displayName = "DiffReport";
    private readonly thumbsStrip: ThumbsStrip;
    private rangesContainer: HTMLDivElement;
    private eventsCount: any;

    constructor (props: Props) {
        super(props);
        if (props.sourceVideo) {
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
        }
        this.state = {
            range : null,
            excludedTypes : {},
            shortEvents : false,
            minFrames : 4
        };
        this.eventsCount = props.ranges.reduce((counts: any, range) => {
            if (!counts[range.matchType]) {
                counts[range.matchType] = 0;
            }
            counts[range.matchType] += 1;
            return counts;
        }, {});
    }

    componentDidMount () {
        if (this.rangesContainer) {
            this.setState({});
        }
    }

    render () {
        const {ranges, comparedVideo, sourceVideo, getImage, eventTypes} = this.props;
        const {excludedTypes, range, shortEvents, minFrames} = this.state;

        return (
            <div className={DiffReport.displayName}>
                {/*<Row className={`${DiffReport.displayName}__header`} gap={"10px"}>*/}
                {/*<DiffTimeline comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}*/}
                {/*getImage={getImage} rangeSelected={this.rangeSelected} selectedRange={range}/>*/}
                {/*</Row>*/}
                <div className={`${DiffReport.displayName}__ranges container`} ref={el => this.rangesContainer = el}>
                    <Row>
                        <Col>
                            <h1>
                                BIGFOOT COMPARE REPORT
                            </h1>
                            <img src="vglogo.png" height="100px"/>
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
                                    {eventTypes.map(type => {
                                        return (
                                            <li key={type}>
                                                <input type="checkbox" id={type} value={type}
                                                       checked={!excludedTypes[type]}
                                                       onChange={e => this.toggleType(type)}/>
                                                <label htmlFor={type}>
                                                    {type} ({this.eventsCount[type] || 0})
                                                </label>
                                            </li>
                                        )
                                    })}
                                </List>
                            </Row>
                            <p>
                                <input type="checkbox" id="short" value="short"
                                       checked={!shortEvents}
                                       onChange={e => this.setState({shortEvents : !shortEvents})}/>
                                <label htmlFor="short">
                                    Filter short events of <input type="number" value={minFrames} min={0}
                                                                  onChange={e => this.setState({minFrames : +e.target.value | 0})}
                                                                  style={{width : "6ch"}}/> frames
                                </label>
                            </p>
                        </Col>
                    </Row>

                    {this.renderRanges()}
                </div>
            </div>)
    }

    rangeSelected = (range: DiffRange) => {
        let rangeIndex = this.props.ranges.indexOf(range);
        if (range != this.state.range && rangeIndex >= 0 && this.rangesContainer) {
            const rangesHtml = this.rangesContainer.querySelectorAll(`.${DiffReport.displayName}__diffrange`);
            const rangeEl = rangesHtml ? rangesHtml[rangeIndex] as HTMLElement : null;
            if (rangeEl) {
                this.onRangeClick(rangeEl, range);
            }
        }
    };

    onRangeClick = (componentElement: HTMLElement, range: DiffRange) => {
        this.setState({range : this.state.range == range ? null : range}, () => {
            if (this.rangesContainer) {
                this.rangesContainer.scrollTo(0, componentElement.offsetTop);
            }
        });
    };

    rangesFilter = (r: DiffRange) => {
        const {excludedTypes, shortEvents, minFrames} = this.state;
        const {r1, r2} = r;
        let includedType = !excludedTypes[r.matchType];
        if (!shortEvents) {
            return (r1.length > minFrames || r2.length > minFrames) && includedType;
        }
        return includedType
    };

    private renderRanges () {
        if (!this.rangesContainer) {
            return null;
        }

        const {ranges, comparedVideo, sourceVideo, getImage} = this.props;
        const cols = this.rangesContainer.clientWidth / this.thumbsStrip.frameWidth | 0;
        return ranges.filter(this.rangesFilter).map((range, i) => {
            let props = {
                range, comparedVideo, sourceVideo,
                cols,
                getImage,
                thumbsStrip : this.thumbsStrip,
                view : this.state.range == range ? ViewMode.DETAILED : ViewMode.BASIC,
                layout : LayoutMode.SPLIT,
                onClick : (el: HTMLElement) => this.onRangeClick(el, range)
            };
            let k = btoa(JSON.stringify(range));
            return (<DiffRangeComponent key={`${k}`} {...props}
                                        className={`${DiffReport.displayName}__diffrange`}/>);
        });
    }


    private toggleType (type: string) {
        const excludedTypes = Object.assign({}, this.state.excludedTypes);
        excludedTypes[type] = !this.state.excludedTypes[type];
        this.setState({excludedTypes});
    }
}

export default DiffReport;