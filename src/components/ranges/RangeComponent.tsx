import * as React from "react";
import "./range.css";
import {IRange} from "bigfootjs/dist/Range";

interface Props {
    range: IRange
}

export const RangeComponent = ({range}: Props) => {

    return (
        <ul className={"range"}>
            <li>start frame: {range.frame}</li>
            <li>frames: {range.length}</li>
        </ul>
    )
};