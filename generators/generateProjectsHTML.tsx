import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import {Project} from "../src/model/Project";
import {DiffRange} from "../src/model/DiffRange";
import DiffRangesApp from "../src/DiffRangesApp";
import {Video} from "../src/model/Video";

function htmlTemplate (title: string, reactDom: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${ title }</title>
        </head>

        <body>
            <div id="app1">${ reactDom }</div>
            <script src="/dist/project.bundle.js"></script>
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
    fs.writeFileSync(`./projects/mrestore-projects/${sourceId}/index.html`, html, 'utf8');
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
    const app = renderToString(<DiffRangesApp ranges={readRangesJson(projectId, comparedMov)}
                                              sourceVideo={sourceVideo}
                                              comparedVideo={comparedVideo}/>);
    const html = htmlTemplate(projectId, app);
    writeRangesHTML(projectId, html);
    return `./projects/mrestore-projects/${projectId}/index.html`;
}


const args = process.argv;
console.log(generateHTML(args[2], args[3]));

