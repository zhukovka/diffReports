import * as fs from "fs";
import {DiffRange} from "bigfootJS/dist/DiffRange";
import {Video} from "bigfootJS/dist/Video";
import {Project} from "bigfootjs/dist/Project";

export function readRangesJson (sourceId: string, comparedMov: string): DiffRange[] {
    const regex = new RegExp(`^ranges_${comparedMov}.*\\.js$`);
    const rangesFile = fs.readdirSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}`).find(file => {
        return regex.test(file);
    });
    const ranges = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${sourceId}/${rangesFile}`, 'utf8');
    return JSON.parse(ranges);
}

export function readProjectJson (projectId: string): Project {
    const project = fs.readFileSync(`${process.env.MRESTORE_PROJECTS}/${projectId}/project.js`, 'utf8');
    return JSON.parse(project);
}
export function readVideoJson (mov: string): Video {
    const videoJs = fs.readFileSync(`${process.env.PROJECT_STORAGE}/${mov}/video.js`, 'utf8');
    return JSON.parse(videoJs);
}
