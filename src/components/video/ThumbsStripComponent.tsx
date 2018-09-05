import ThumbsStrip, {Strip} from "../../model/ThumbsStrip";
import * as React from "react";
import "./video.css";

interface Props {
    getSrc: (page: number) => string;
    thumbsStrip: ThumbsStrip;
    startFrame: number;
    endFrame: number;
}

class ThumbsStripComponent extends React.Component<Props, any> {

    setupCanvas = (canvas: HTMLCanvasElement) => {
        const {thumbsStrip, startFrame, endFrame, getSrc} = this.props;
        if (!canvas || endFrame - startFrame < 0) {
            return;
        }
        const ctx = canvas.getContext('2d');

        const boards: { [page: string]: Strip[] } = thumbsStrip.stripsForFrames(startFrame, endFrame);

        let offset = {x : 0, y : 0};

        const images = Object.keys(boards).map((page, i) => {

            let srcCoords = boards[page];
            let srcMapToDest: Map<Strip, Strip[]> = thumbsStrip.stripsToCanvas(srcCoords, offset);
            let lastSrc = srcMapToDest.get(srcCoords[srcCoords.length - 1]);
            let lastDest = lastSrc[lastSrc.length - 1];
            offset = {x : lastDest.x + lastDest.width, y : lastDest.y};

            const img = new Image();
            img.src = getSrc(+page);
            img.onload = () => {
                for (const [src, dest] of srcMapToDest) {
                    let x = src.x;
                    for (const d of dest) {
                        ctx.drawImage(img, x, src.y, d.width, src.height, d.x, d.y, d.width, d.height);
                        x += d.frames * thumbsStrip.frameWidth;
                    }
                }
            };
            return img;
        });

    };

    render () {
        const {thumbsStrip, startFrame, endFrame} = this.props;
        let frames = (endFrame - startFrame + 1);

        const width = thumbsStrip.frameWidth * Math.min(frames, thumbsStrip.cols);
        const height = Math.ceil(frames / thumbsStrip.cols) * thumbsStrip.frameHeight;
        return <div className={"ThumbsStripComponent"}>
            <canvas ref={this.setupCanvas} width={width} height={height}/>
        </div>
    }
}

export default ThumbsStripComponent;