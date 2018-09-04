import * as React from "react";
import "./layout.css";
import {Align, Justify, ReactElementProps} from "../../common/react-interfaces";
import {classNameFrom} from "../../utils/CSSUtils";

interface RowProps extends ReactElementProps {
    align?: Align;
    alignSelf?: Align;
    justify?: Justify;
    direction?: "row" | "col";
    gap?: string;
}

const Row = ({children, align, justify, direction, alignSelf, className, gap}: RowProps) => {
    let classNames = [classNameFrom(className), classNameFrom(align, "align-"), classNameFrom(justify, "justify-"), classNameFrom(direction, "direction-"), classNameFrom(alignSelf, "align-self-")];
    let _className = `row ${classNames.join(" ")}`.trim();
    // @ts-ignore
    return (<div className={_className} style={{"--row-gap" : gap}}>
        {children}
    </div>);
};

export default Row;