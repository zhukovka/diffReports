require('dotenv').config();
import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import {Project} from "../src/model/Project";
import {DiffRange} from "../src/model/DiffRange";
import DiffReport from "../src/DiffReport";
import {Video} from "../src/model/Video";

const program = require('commander');

program
    .option('-p, --projectId <id>', 'Project id')
    .option('-c, --comparedMov <mov>', 'Compared video id')
    .parse(process.argv);

function htmlTemplate (title: string, reactDom: string, script: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${ title }</title>
            <link rel="stylesheet" href="project.css">
        </head>

        <body>
            <div id="app">${ reactDom }</div>
            <script src="project.bundle.js"></script>
            ${script}
        </body>
        </html>
    `;
}

function readRangesJson (sourceId: string, comparedMov: string): DiffRange[] {
    const regex = new RegExp(`^ranges_${comparedMov}.*\\.js$`);
    // @ts-ignore
    const rangesFile = fs.readdirSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}`).find(file => {
        return regex.test(file);
    });
    const ranges = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}/${rangesFile}`, 'utf8');
    return JSON.parse(ranges);
}

function readProjectJson (projectId: string): Project {
    const project = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${projectId}/project.js`, 'utf8');
    return JSON.parse(project);
}

function writeRangesHTML (sourceId: string, html: string): string {
    let path = `./reports/${sourceId}/index.html`;
    fs.writeFileSync(path, html, 'utf8');
    return path;
}

function readVideoJson (mov: string): Video {
    const videoJs = fs.readFileSync(`${process.env.PROJECT_STORAGE}/${mov}/video.js`, 'utf8');
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
    return writeRangesHTML(projectId, html);
}

let {projectId, comparedMov} = program;

if (process.env.NODE_ENV == 'production') {
    fs.copyFileSync('./dist/project.bundle.js', `./reports/${projectId}/project.bundle.js`);
    fs.copyFileSync('./dist/project.css', `./reports/${projectId}/project.css`);
//    mkdir -p reports/salt_color_trim3k/salt_color_trim3k.mov/stripes/ && cp -r projects/storage/salt_color_trim3k.mov/stripes/square/ "$_"
}

console.log(generateHTML(projectId, comparedMov));



