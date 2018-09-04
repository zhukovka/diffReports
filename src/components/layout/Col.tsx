import * as React from "react";
import "./layout.css";
import {Align, ReactElementProps} from "../../common/react-interfaces";
import {classNameFrom} from "../../utils/CSSUtils";

interface Props extends ReactElementProps {
    col?: number
}

const Col = ({children, col, className}: Props) => {
    return (<div className={`col ${classNameFrom(col, 'col-')} ${classNameFrom(className)}`}>
        {children}
    </div>);
};

export default Col;