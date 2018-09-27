import * as ReactDOM from "react-dom";
import * as React from "react";
import DiffReport from "./DiffReport";
import {DiffRange} from "./model/DiffRange";
import {IVideo} from "./model/Video";
import DiffReportsApi from "./model/DiffReportsApi";

interface Props {
    ranges: DiffRange[],
    sourceVideo: IVideo,
    comparedVideo: IVideo,
    projectId: string
}

export const App = ({ranges, sourceVideo, comparedVideo, projectId}: Props) => {
    let api = new DiffReportsApi(projectId);
    return (<DiffReport comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}
                        getImage={api.getImage.bind(api)}/>);
};

function diffReport (ranges: DiffRange[], sourceVideo: IVideo, comparedVideo: IVideo, projectId: string) {
    const app = document.getElementById("app");
    ReactDOM.hydrate(<App projectId={projectId} comparedVideo={comparedVideo} ranges={ranges}
                          sourceVideo={sourceVideo}/>, app);
}


if (typeof window != "undefined") {
// @ts-ignore
    window.diffReport = diffReport;
}


