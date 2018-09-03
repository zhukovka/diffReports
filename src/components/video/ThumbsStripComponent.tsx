import ThumbsStrip, {Strip} from "../../model/ThumbsStrip";
import * as React from "react";

interface Props {
    getSrc: (page: number) => string;
    thumbsStrip: ThumbsStrip;
    startFrame: number;
    endFrame: number;
}

class ThumbsStripComponent extends React.Component<Props, any> {

    setupCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');
        const {thumbsStrip, startFrame, endFrame, getSrc} = this.props;
        canvas.width = thumbsStrip.frameWidth * (endFrame - startFrame + 1);
        canvas.height = thumbsStrip.frameHeight;
        //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        const strips: { [page: string]: Strip[] } = thumbsStrip.stripsForFrames(startFrame, endFrame);
        let dx = 0;

        const images = Object.keys(strips).map((page, i) => {

            return fetch(getSrc(+page)).then(res => res.blob()).then(blob => createImageBitmap(blob))
                .then(img => {
                    for (const strip of strips[page]) {
                        ctx.drawImage(img, strip.x, strip.y, strip.width, strip.height, dx, 0, strip.width, strip.height);
                        dx += strip.width;
                    }
                    return img;
                });
        });

    };

    render () {
        return <div>
            <canvas ref={this.setupCanvas}/>
        </div>
    }
}

export default ThumbsStripComponent;