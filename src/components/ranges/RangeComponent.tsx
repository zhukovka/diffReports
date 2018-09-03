import {Range} from "../../model/Range";
import * as React from "react";

interface Props {
    range: Range
}

export const RangeComponent = ({range}: Props) => {

    return (
        <ul>
            <li>frame: {range.frame}</li>
            <li>length: {range.length}</li>
        </ul>
    )
};