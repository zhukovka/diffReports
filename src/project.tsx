import * as ReactDOM from "react-dom";
import * as React from "react";
import DiffReport from "./DiffReport";
import {DiffRange} from "./model/DiffRange";
import {Video} from "./model/Video";

function diffReport (ranges: DiffRange[], sourceVideo: Video, comparedVideo: Video) {
    const app = document.getElementById("app");
    ReactDOM.hydrate(<DiffReport comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}/>, app);
}

if (typeof window != "undefined") {
// @ts-ignore
    window.diffReport = diffReport;
}


