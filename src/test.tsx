import * as ReactDOM from "react-dom";
import * as React from "react";
import DiffTimeline from "./components/ranges/DiffTimeline";
import DiffReportsApi from "./model/DiffReportsApi";
import {DiffRange} from "bigfootJS/dist/DiffRange";
import {Video} from "bigfootJS/dist/Video";

interface Props {
    ranges: DiffRange[],
    sourceVideo: Video,
    comparedVideo: Video,
    api: DiffReportsApi
}

export const TestPage = ({ranges, sourceVideo, comparedVideo, api}: Props) => {
    return <DiffTimeline comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}
                         getImage={api.getImage.bind(api)} rangeSelected={(r) => console.log(r)}/>
};

function diffReport (ranges: DiffRange[], sourceVideo: Video, comparedVideo: Video, projectId: string) {
    let api = new DiffReportsApi(projectId);
    const app = document.getElementById("app");
    ReactDOM.hydrate(<TestPage comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}
                               api={api}/>, app);
}

if (typeof window != "undefined") {
// @ts-ignore
    window.diffReport = diffReport;
}