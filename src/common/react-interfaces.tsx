export interface ReactElementProps {
    children?: any;
    className?: string;
}

export type Align = "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "stretch";

export type Justify =
    "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";