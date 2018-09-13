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
import {LayoutMode} from "./common/LayoutMode";
import DiffTimeline from "./components/ranges/DiffTimeline";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;

    getImage (videoId: string, page: number): Promise<HTMLImageElement>
}

interface State {
    types: { [type: string]: boolean };
    range: DiffRange;

}

const COLS = 10;
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;

class DiffReport extends React.Component<Props, State> {
    static displayName = "DiffReport";
    private readonly thumbsStrip: ThumbsStrip;
    private rangesContainer: HTMLDivElement;

    constructor (props: Props) {
        super(props);
        if (props.sourceVideo) {
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
        }
        this.state = {
            range : null,
            types : Object.assign({}, MatchType as any),
        };
    }

    componentDidMount () {
        console.log('Component Mount on Client Side...', this.props);
        console.log('ref', this.rangesContainer);
        if (this.rangesContainer) {
            this.setState({});
        }
    }

    render () {
        const {ranges, comparedVideo, sourceVideo, getImage} = this.props;
        const {types, range} = this.state;
        const eventsCount = ranges.reduce((counts: any, range) => {
            if (!counts[range.matchType]) {
                counts[range.matchType] = 0;
            }
            counts[range.matchType] += 1;
            return counts;
        }, {});
        return (
            <div className={DiffReport.displayName}>
                <Row className={`${DiffReport.displayName}__header`} gap={"10px"}>
                    <DiffTimeline comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}
                                  getImage={getImage} rangeSelected={this.rangeSelected} selectedRange={range}/>
                </Row>
                <div className={`${DiffReport.displayName}__ranges container`} ref={el => this.rangesContainer = el}>
                    <Row>
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

    private renderRanges () {
        const {types} = this.state;
        if (!this.rangesContainer) {
            return null;
        }

        const {ranges, comparedVideo, sourceVideo, getImage} = this.props;
        const cols = this.rangesContainer.clientWidth / this.thumbsStrip.frameWidth | 0;
        return ranges.filter(r => !!types[r.matchType]).map((range, i) => {
            let props = {
                range, comparedVideo, sourceVideo,
                cols,
                getImage,
                thumbsStrip : this.thumbsStrip,
                layout : this.state.range == range ? LayoutMode.DETAILED : LayoutMode.BASIC,
                onClick : (el: HTMLElement) => this.onRangeClick(el, range)
            };
            return (<DiffRangeComponent key={i} {...props} className={`${DiffReport.displayName}__diffrange`}/>);
        });
    }


    private toggleType (type: string) {
        const types = Object.assign({}, this.state.types);
        types[type] = !this.state.types[type];
        this.setState({types});
    }
}

export default DiffReport;