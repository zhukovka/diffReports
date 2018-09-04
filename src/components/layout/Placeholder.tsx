import * as React from "react";
import "./layout.css";
import {Align, Justify, ReactElementProps} from "../../common/react-interfaces";
import {classNameFrom} from "../../utils/CSSUtils";

interface PlaceholderProps extends ReactElementProps {
    width: string;
    height: string;
    background?: string;
}

const Placeholder = ({className, width, height, background}: PlaceholderProps) => {
    let _className = `placeholder ${classNameFrom(className)}`;
    const _style = {
        "--placeholder-width" : width,
        "--placeholder-height" : height,
        "--placeholder-background" : background,
    };
    // @ts-ignore
    return (<div className={_className.trim()} style={_style}/>);
};

export default Placeholder;