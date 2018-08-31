import 'mocha';
import {expect} from 'chai';
import ThumbsStrip from "../src/model/ThumbsStrip";

const cols = 10;
const rows = 24;
//120*68
const width = 120;
const height = 68;
const thumbs = new ThumbsStrip(cols, rows, width, height);

describe('Thumbs calculating function', () => {

    it('should return thumbs from 0 to 9', () => {
        const from = 0;
        const to = 9;
        const coords = thumbs.coordsForFrames(from, to);
        const expetedCoords = [{x : 0, y : 0, width : 1200, height : 68}];
        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });
    it('should return thumbs from 0 to 10', () => {
        const coords = thumbs.coordsForFrames(0, 10);
        const expetedCoords = [{x : 0, y : 0, width : 1200, height : 68},
            {x : 0, y : 68, width : 120, height : 68}];
        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });
    it('should return thumbs from 1 to 24', () => {
        const coords = thumbs.coordsForFrames(1, 24);
        const expetedCoords = [{x : 120, y : 0, width : 1080, height : 68},
            {x : 0, y : 68, width : 1200, height : 68},
            {x : 0, y : 136, width : 600, height : 68}];

        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });
    it('should return thumbs from 15 to 16', () => {
        const coords = thumbs.coordsForFrames(15, 16);
        const expetedCoords = [{x : 600, y : 68, width : 240, height : 68}];

        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });
    it('should return thumbs from 16 to 33', () => {
        const coords = thumbs.coordsForFrames(16, 33);
        const expetedCoords = [{x : 720, y : 68, width : 480, height : 68},
            {x : 0, y : 136, width : 1200, height : 68},
            {x : 0, y : 204, width : 480, height : 68}];

        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });
    it('should return thumbs from 239 to 240', () => {
        const coords = thumbs.coordsForFrames(239, 240);
        const expetedCoords = [{x : 1080, y : 1564, width : 120, height : 68},
            {x : 0, y : 0, width : 120, height : 68}];

        console.log(coords);
        expect(coords).to.deep.equal(expetedCoords);
    });

});

