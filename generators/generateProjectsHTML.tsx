import * as React from "react";
import {renderToString} from "react-dom/server";
import * as fs from "fs";


function htmlTemplate (title: string, reactDom: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${ title }</title>
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script src="/dist/project.bundle.js"></script>
        </body>
        </html>
    `;
}

function loadRanges (sourceId: string, comparedId: string) {
    const regex = new RegExp(`^ranges_${comparedId}.*\\.js$`);
    // @ts-ignore
    const rangesFile = fs.readdirSync(`./projects/mrestore-projects/${sourceId}`).find(file => {
        return regex.test(file);
    });
    const ranges = fs.readFileSync(`./projects/mrestore-projects/${sourceId}/${rangesFile}`, 'utf8');
}
function generateHTML (projectId: string) {
    const projectString = fs.readFileSync(`projects/mrestore-projects/${projectId}/project.js`, 'utf8');
    const project = JSON.parse(projectString);
    const app = renderToString(<div>{projectId}</div>);
    return htmlTemplate(projectId, app);
}


const args = process.argv;
console.log(generateHTML(args[2]));

