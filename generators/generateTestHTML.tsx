import {readProjectJson, readRangesJson, readVideoJson} from "./projectUtils";
import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import DiffReport from "../src/DiffReport";
import {TestPage} from "../src/test";
import DiffReportsApi from "../src/model/DiffReportsApi";

require('dotenv').config();

const program = require('commander');

program
    .option('-p, --projectId <id>', 'Project id')
    .option('-c, --comparedMov <mov>', 'Compared video id')
    .parse(process.argv);


export function htmlTemplate (title: string, reactDom: string, script: string) {
    let staticDir = '.';
    if (process.env.NODE_ENV !== 'production') {
        staticDir = `/${process.env.BUNDLE_PATH}`;
    }
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${ title }</title>
            <link rel="stylesheet" href="${staticDir}/project.css">
        </head>

        <body>
            <div id="app">${ reactDom }</div>
            <script src="${staticDir}/test.bundle.js"></script>
            ${script}
        </body>
        </html>
    `;
}

function writeHTML (html: string): string {
    let path = `./tests/index.html`;
    fs.writeFileSync(path, html, 'utf8');
    return path;
}


function generateHTML (projectId: string, comparedMov: string) {
    const project = readProjectJson(projectId);
    const sourceMov = project.masterId;
    const sourceVideo = readVideoJson(sourceMov);
    const comparedVideo = readVideoJson(comparedMov);
    let ranges = readRangesJson(projectId, comparedMov);
    let api = new DiffReportsApi(projectId);
    const app = renderToString(<TestPage comparedVideo={comparedVideo} ranges={ranges} sourceVideo={sourceVideo}
                                         api={api}/>);

    const script = `<script>
            diffReport(${JSON.stringify(ranges)}, ${JSON.stringify(sourceVideo)}, ${JSON.stringify(comparedVideo)}, "${projectId}");
    </script>`;

    const html = htmlTemplate(projectId, app, script);
    return writeHTML(html);
}

let {projectId, comparedMov} = program;

//    mkdir -p reports/salt_color_trim3k/salt_color_trim3k.mov/stripes/ && cp -r projects/storage/salt_color_trim3k.mov/stripes/square/ "$_"
console.log(generateHTML(projectId, comparedMov));



