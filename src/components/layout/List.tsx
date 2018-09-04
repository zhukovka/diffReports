import * as React from "react";
import "./layout.css";
import {Align, Justify, ReactElementProps} from "../../common/react-interfaces";
import {classNameFrom} from "../../utils/CSSUtils";

interface ListProps extends ReactElementProps {
}

const List = ({children, className}: ListProps) => {
    let _className = `list ${classNameFrom(className)}`;
    return (<ul className={_className.trim()}>
        {children}
    </ul>);
};

export default List;