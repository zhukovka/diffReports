import * as React from "react";
import "./layout.css";
import {Align, ReactElementProps} from "../../common/react-interfaces";

interface RowProps extends ReactElementProps {
    align?: Align;
}

const Row = ({children}: RowProps) => {
    return (<div className={"row"}>
        {children}
    </div>);
};

export default Row;