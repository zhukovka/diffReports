import * as React from "react";
import {DiffRange} from "./model/DiffRange";
import DiffRangeComponent from "./components/ranges/DiffRangeComponent";
import {Video} from "./model/Video";
import Row from "./components/layout/Row";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
}

interface State {
}

class DiffRangesApp extends React.Component<Props, State> {
    render () {
        const {ranges, comparedVideo, sourceVideo} = this.props;
        return (
            <div>
                <Row>
                    <div>
                        {sourceVideo.id}
                    </div>
                    <div>
                        {comparedVideo.id}
                    </div>
                </Row>
                <div>
                    {ranges.map((range, i) => (<DiffRangeComponent key={i} range={range}/>))}
                </div>
            </div>)
    }

}

export default DiffRangesApp;