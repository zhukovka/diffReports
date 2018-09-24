import * as React from "react";
import "./range.css";
import {IRange} from "bigfootJS/dist/Range";

interface Props {
    range: IRange
}

export const RangeComponent = ({range}: Props) => {

    return (
        <ul className={"range"}>
            <li>frame: {range.frame}</li>
            <li>length: {range.length}</li>
        </ul>
    )
};