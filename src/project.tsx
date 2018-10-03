import * as ReactDOM from "react-dom";
import * as React from "react";
import DiffReport from "./DiffReport";
import DiffReportsApi from "./model/DiffReportsApi";
import {DiffRange, MatchType} from "bigfootjs/dist/DiffRange";
import {IVideo} from "bigfootjs/dist/Video";

interface Props {
    ranges: DiffRange[],
    sourceVideo: IVideo,
    comparedVideo: IVideo,
    projectId: string
}

export const App = ({ranges, sourceVideo, comparedVideo, projectId}: Props) => {
    let api = new DiffReportsApi(projectId);
    return (<DiffReport comparedVideo={comparedVideo}
                        ranges={ranges.filter(r => r.matchType != MatchType.MOVED_TO && r.matchType != MatchType.MOVED)}
                        sourceVideo={sourceVideo}
                        eventTypes={Object.keys(MatchType).filter(type => type != MatchType.MOVED_TO && type != MatchType.MOVED)}
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


