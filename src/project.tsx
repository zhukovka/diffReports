import * as ReactDOM from "react-dom";
import * as React from "react";
import DiffReport from "./DiffReport";
import DiffReportsApi from "./model/DiffReportsApi";
import {DiffRange, MatchType} from "bigfootjs/dist/DiffRange";
import {IVideo} from "bigfootjs/dist/Video";

// ranges: DiffRange[], sourceVideo: IVideo, comparedVideo: IVideo,
function diffReport (projectId: string) {
    let api = new DiffReportsApi(projectId);
    // graphql(schema, `query Matches { matches{movieId} }`, root, context)
    api.query('query Ranges { ranges {matchType} }').then((response: any) => {
        console.log(response);
    });
//     console.log("diff");
//
//
//     //${JSON.stringify(ranges)}, ${JSON.stringify(sourceVideo)}, ${JSON.stringify(comparedVideo)}, "${projectId}"
//     // const app = document.getElementById("app");
// Render basic layout
// ReactDOM.hydrate(<App projectId={projectId} comparedVideo={comparedVideo} ranges={ranges}
//                       sourceVideo={sourceVideo}/>, app);
}

//
//
if (typeof window != "undefined") {
// @ts-ignore
    window.diffReport = diffReport;
}


