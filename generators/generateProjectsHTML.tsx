import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import {Project} from "../src/model/Project";
import {DiffRange} from "../src/model/DiffRange";
import DiffReport from "../src/DiffReport";
import {Video} from "../src/model/Video";

function htmlTemplate (title: string, reactDom: string, script: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${ title }</title>
            <link rel="stylesheet" href="/dist/project.css">
        </head>

        <body>
            <div id="app">${ reactDom }</div>
            <script src="/dist/project.bundle.js"></script>
            ${script}
        </body>
        </html>
    `;
}

function readRangesJson (sourceId: string, comparedMov: string): DiffRange[] {
    const regex = new RegExp(`^ranges_${comparedMov}.*\\.js$`);
    // @ts-ignore
    const rangesFile = fs.readdirSync(`./projects/mrestore-projects/${sourceId}`).find(file => {
        return regex.test(file);
    });
    const ranges = fs.readFileSync(`./projects/mrestore-projects/${sourceId}/${rangesFile}`, 'utf8');
    return JSON.parse(ranges);
}

function readProjectJson (projectId: string): Project {
    const project = fs.readFileSync(`projects/mrestore-projects/${projectId}/project.js`, 'utf8');
    return JSON.parse(project);
}

function writeRangesHTML (sourceId: string, html: string) {
    fs.writeFileSync(`./reports/${sourceId}/index.html`, html, 'utf8');
}

function readVideoJson (mov: string): Video {
    const videoJs = fs.readFileSync(`projects/storage/${mov}/video.js`, 'utf8');
    return JSON.parse(videoJs);
}

function generateHTML (projectId: string, comparedMov: string) {
    const project = readProjectJson(projectId);
    const sourceMov = project.masterId;
    const sourceVideo = readVideoJson(sourceMov);
    const comparedVideo = readVideoJson(comparedMov);
    let ranges = readRangesJson(projectId, comparedMov);
    const app = renderToString(<DiffReport ranges={ranges}
                                           sourceVideo={sourceVideo}
                                           comparedVideo={comparedVideo}/>);
    const script = `<script>
            diffReport(${JSON.stringify(ranges)}, ${JSON.stringify(sourceVideo)}, ${JSON.stringify(comparedVideo)});
    </script>`;
    const html = htmlTemplate(projectId, app, script);
    writeRangesHTML(projectId, html);
    return `./reports/${projectId}/index.html`;
}


const args = process.argv;
console.log(generateHTML(args[2], args[3]));

