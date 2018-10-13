import {readProjectJson, readRangesJson, readVideoJson} from "./projectUtils";
import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";
import {exec} from "child_process";
import {MessageType} from "../src/model/DiffMessage";

require('dotenv').config();

const program = require('commander');

program
    .option('-p, --projectId <id>', 'Project id')
    .option('-c, --comparedMov <mov>', 'Compared video id')
    .parse(process.argv);


export function htmlTemplate (title: string, reactDom: string, script: string) {
    let staticDir = '.';
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
    let path = `${process.env.REPORTS_PATH}/${sourceId}/index.html`;
    fs.writeFileSync(path, html, 'utf8');
    return path;
}


function generateHTML (projectId: string, comparedMov: string) {
    let storageDir = `${process.env.PROJECT_STORAGE}`;
    const project = readProjectJson(projectId);
    const sourceMov = project.masterId;
    const sourceVideo = readVideoJson(sourceMov);
    const comparedVideo = readVideoJson(comparedMov);

    if (!fs.existsSync(`${reportDir}/${sourceMov}`)) {
        let copySource = `mkdir -p ${reportDir}/${sourceMov} && cp -r ${storageDir}/${sourceMov}/stripes ${reportDir}/${sourceMov}`;
        let copyCompared = `mkdir -p ${reportDir}/${comparedMov} && cp -r ${storageDir}/${comparedMov}/stripes ${reportDir}/${comparedMov}`;
        console.log(copySource);
        console.log(copyCompared);
        let dir = exec(`(${copySource}; ${copyCompared})`, function (err, stdout, stderr) {
            if (err) {
                // should have err.code here?
            }
            console.log(stdout);
        });

        dir.on('exit', function (code) {
            // exit code is code
        });
    }

    const copyDist = `find ${process.env.BUNDLE_PATH}/ ! -name test.bundle.js -type f -exec cp {} ${process.env.REPORTS_PATH}/${projectId}/ \\;`;
    let dist = exec(copyDist, function (err, stdout, stderr) {
        if (err) {
            // should have err.code here?
            console.log(err)
        }
        console.log(stdout);
    });
    console.log(copyDist)

    let ranges = readRangesJson(projectId, comparedMov);
    // let schema = fs.readFileSync('schema.graphqls', 'utf-8');
    // const app = renderToString(<App projectId={projectId} comparedVideo={comparedVideo} ranges={ranges}
    //                                 sourceVideo={sourceVideo}/>);
    const app = "";
    const data = {ranges, comparedVideo, sourceVideo, projectId, type : MessageType.INITIAL};
    const script = `<script>
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("serviceworker.bundle.js").then(function (registration) {
                console.log("Service Worker registered with scope:", registration.scope);
            }).catch(function (err) {
                console.log("Service Worker registration failed:", err);
            });
        }
        const worker = new Worker("worker.bundle.js");
        worker.postMessage(${JSON.stringify(data)});
        worker.onmessage = (e) => {
            console.log("generator message",e);
            diffReport("${projectId}");
        };
    </script>`;

    const html = htmlTemplate(projectId, app, script);
    return writeRangesHTML(projectId, html);
}

let {projectId, comparedMov} = program;
let reportDir = `${process.env.REPORTS_PATH}/${projectId}`;

console.log(fs.existsSync(reportDir))
if (!fs.existsSync(reportDir)) {
    console.log(`create ${reportDir}`);
    fs.mkdirSync(reportDir);
}

//    npm run bundle -- --projectId K01_K04 --comparedMov kid_brother_133_HD_prores_422hq_709_H264-TC-WM.mp4
//    npm run bundle -- --projectId K02_K03 --comparedMov kid_brother_133_HD_prores_422hq_709_H264.mp4
//    npm run bundle -- --projectId K03_K04 --comparedMov kid_brother_133_HD_prores_422hq_709_H264-TC-WM.mp4
//    npm run bundle -- --projectId K02_K04 --comparedMov kid_brother_133_HD_prores_422hq_709_H264-TC-WM.mp4
//    Friends
//    npm run bundle -- --projectId YR10_S10_R3 --comparedMov Friends_S10_176251_R3_R1312222_2trkcomp_ALL_eng_24_48k_20614A13D91BA7B1E58CQ.mp4
//    npm run bundle -- --projectId YR10_S10_R2 --comparedMov Friends_S10_176251_R2_R1312222_2trkcomp_ALL_eng_24_48k_20614A13D91BA7B1E58CQ.mp4
//    npm run bundle -- --projectId YR10_S10_R1_diff --comparedMov Friends_S10_176251_R1_R1312222_2trkcomp_ALL_eng_24_48k_20614A13D91BA7B1E58CQ.mp4
//    npm run bundle -- --projectId YR5_S05_01_diff --comparedMov Friends_s05_ep467664_reel01_80df2f2ccd12ed942d51r_proxy.mp4
//    npm run bundle -- --projectId YR5_S05_02_diff --comparedMov Friends_s05_ep467664_reel02_80df2f2ccd12ed942d51r_proxy.mp4
//    npm run bundle -- --projectId YR10_0700507_24 --comparedMov Friends_Ep176251_EngSt_MnESt_0700507_SD_4x3_133_2997_DFTC_24.mp4
//    npm run bundle -- --projectId YR10_0700502_24 --comparedMov Friends_Ep176251_EngSt_MnESt_0700502_SD_4x3_133_2997_DFTC_24.mp4
//    npm run bundle -- --projectId YR01_S01_02_24 --comparedMov Friends_s01_ep456662_reel02_f4994eaf2b302c8da7e5p_proxy_24.mp4
//    npm run bundle -- --projectId YR01_S01_01_24 --comparedMov Friends_s01_ep456662_reel01_f4994eaf2b302c8da7e5p_proxy_24.mp4
//    npm run bundle -- --projectId YR01_456662_24 --comparedMov Friends_Ep456662_EngSt_0700497_SD_4x3_133_2997_DFTC_24.mp4
//    npm run bundle -- --projectId YR01_018_24 --comparedMov Friends_Ep018_EngSt_LasSt_0700493_HD_16x9_178_2997i_24.mp4
//    npm run bundle -- --projectId YR05_467664 --comparedMov Friends_Ep467664_EngSt_MnESt_0700506_SD_4x3_133_2997_DFTC_24.mp4
//    npm run bundle -- --projectId YR05_111_24 --comparedMov Friends_Ep111_EngSt_LasSt_0700631_HD_16x9_178_2997i_24.mp4
//    npm run bundle -- --projectId YR10_219_24 --comparedMov Friends_Ep219_EngSt_LasSt_0700630_HD_16x9_178_2997i_24.mp4

console.log(generateHTML(projectId, comparedMov));



