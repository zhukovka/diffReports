import {FrameStrip, Strip} from "../../model/ThumbsStrip";
import * as React from "react";
import "./video.css";

interface Props {
    getSrc: (frame: number) => string;
    strip: Map<FrameStrip, Strip>,
    width: number,
    height: number
}

class ThumbsStripComponent extends React.Component<Props, any> {

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {strip, getSrc} = this.props;
        if (!canvas || !strip.size) {
            return;
        }
        const ctx = canvas.getContext('2d');
        const images = [...strip.keys()].map((src, i) => {
            let dest = strip.get(src);
            const img = new Image();
            img.src = getSrc(src.startFrame);
            img.onload = () => {
                ctx.drawImage(img, src.x, src.y, src.width, src.height, dest.x, dest.y, dest.width, dest.height);
            };
            return img;
        });

    };

    render () {
        const {width, height} = this.props;
        return <div className={"ThumbsStripComponent"}>
            <canvas ref={this.setupCanvas} width={width} height={height}/>
        </div>
    }
}

export default ThumbsStripComponent;