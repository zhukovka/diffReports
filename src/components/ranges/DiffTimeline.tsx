import * as React from "react";
import {DiffRange, MatchType} from "../../model/DiffRange";
import ThumbsStrip from "../../model/ThumbsStrip";
import {Video} from "../../model/Video";

interface Props {
    ranges: DiffRange[];
    sourceVideo: Video;
    comparedVideo: Video;
}

const NAME = "DiffTimeline";
const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 68;
const COLS = 10;

class DiffTimeline extends React.Component<Props, any> {

    private readonly thumbsStrip: ThumbsStrip;

    constructor (props: Props) {
        super(props);
        if (props.sourceVideo) {
            this.thumbsStrip = new ThumbsStrip(COLS, props.sourceVideo.timecodeRate, FRAME_WIDTH, FRAME_HEIGHT);
        }
        this.state = {};
    }

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {ranges} = this.props;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');
        const y1 = 0;
        const y2 = this.thumbsStrip.frameHeight;
        let lastX = 0;
        // ctx.fillStyle = 'green';
        // ctx.fillRect(x, y, width, height);
    };

    render () {
        const {ranges} = this.props;
        const height = this.thumbsStrip.frameHeight * 2;
        // const width =
        return <div className={NAME}>
            <canvas className={`${NAME}__canvas`} ref={this.setupCanvas} width={"100%"} height={height}/>
        </div>
    }
}

export default DiffTimeline;

