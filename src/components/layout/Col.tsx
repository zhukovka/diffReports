import * as React from "react";
import "./layout.css";
import {Align, ReactElementProps} from "../../common/react-interfaces";

interface Props extends ReactElementProps {
    col?: number
}

const Col = ({children, col}: Props) => {
    return (<div className={`col${col ? '-' + col : ''}`}>
        {children}
    </div>);
};

export default Col;