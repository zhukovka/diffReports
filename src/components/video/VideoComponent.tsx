import * as React from "react";
import {ReactElementProps} from "../../common/react-interfaces";
import {classNameFrom} from "../../utils/CSSUtils";
import {formatTime} from "../../utils/TimeUtils";
import "./video.css";
import {IVideo} from "bigfootjs/dist/Video";

interface VideoProps extends ReactElementProps {
    video: IVideo;
}

const NAME = `VideoComponent`;
const VideoComponent = ({className, video}: VideoProps) => {
    const _class = classNameFrom(className);
    return (
        <div className={_class}>
            <div className={`${NAME} ${_class}-id`}>
                {video.filename}
            </div>
            <div className={`${NAME} ${_class}-duration`}>
                {formatTime((video.framesTotal / video.timecodeRate) | 0)}
            </div>
        </div>
    );
};

export default VideoComponent;