import {readProjectJson, readRangesJson, readVideoJson} from "./projectUtils";
import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import {App} from "../src/project";

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
            <script src="${staticDir}/project.bundle.js"></script>
            ${script}
        </body>
        </html>
    `;
}

function writeRangesHTML (sourceId: string, html: string): string {
    let path = `./reports/${sourceId}/index.html`;
    fs.writeFileSync(path, html, 'utf8');
    return path;
}


function generateHTML (projectId: string, comparedMov: string) {
    const project = readProjectJson(projectId);
    const sourceMov = project.masterId;
    const sourceVideo = readVideoJson(sourceMov);
    const comparedVideo = readVideoJson(comparedMov);
    let ranges = readRangesJson(projectId, comparedMov);
    const app = renderToString(<App projectId={projectId} comparedVideo={comparedVideo} ranges={ranges}
                                    sourceVideo={sourceVideo}/>);

    const script = `<script>
            diffReport(${JSON.stringify(ranges)}, ${JSON.stringify(sourceVideo)}, ${JSON.stringify(comparedVideo)}, "${projectId}");
    </script>`;

    const html = htmlTemplate(projectId, app, script);
    return writeRangesHTML(projectId, html);
}

let {projectId, comparedMov} = program;


if (process.env.NODE_ENV == 'production') {
    fs.copyFileSync(`${process.env.BUNDLE_PATH}/project.bundle.js`, `./reports/${projectId}/project.bundle.js`);
    fs.copyFileSync(`${process.env.BUNDLE_PATH}/project.css`, `./reports/${projectId}/project.css`);
//    mkdir -p reports/salt_color_trim3k/salt_color_trim3k.mov/stripes/ && cp -r projects/storage/salt_color_trim3k.mov/stripes/square/ "$_"
//    mkdir -p reports/salt_color_trim3k/salt_dc_color_trim3k.mov/stripes/ && cp -r projects/storage/salt_color_trim3k.mov/stripes/square/ "$_"
}
console.log(generateHTML(projectId, comparedMov));



