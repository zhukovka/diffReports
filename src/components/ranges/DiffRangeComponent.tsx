import {ReactElementProps} from "../../common/react-interfaces";
import {DiffRange} from "../../model/DiffRange";
import Row from "../layout/Row";
import * as React from "react";

interface Props extends ReactElementProps {
    range: DiffRange;
}

const DiffRangeComponent = ({range}: Props) => {
    return (<Row>
        <div>{JSON.stringify(range)}</div>
    </Row>)
};

export default DiffRangeComponent;