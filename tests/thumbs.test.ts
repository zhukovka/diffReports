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
        const strips = thumbs.stripsForFrames(from, to);
        const expected = [{x : 0, y : 0, width : 1200, height : 68, frames : 10}];
        console.log(strips);
        expect(strips[0]).to.deep.equal(expected);
    });
    it('should return thumbs from 0 to 10', () => {
        const strips = thumbs.stripsForFrames(0, 10);
        const expected = [{x : 0, y : 0, width : 1200, height : 68, frames : 10},
            {x : 0, y : 68, width : 120, height : 68, frames : 1}];
        console.log(strips);
        expect(strips[0]).to.deep.equal(expected);
    });
    it('should return thumbs from 1 to 24', () => {
        const strips = thumbs.stripsForFrames(1, 24);
        const expected = [{x : 120, y : 0, width : 1080, height : 68, frames : 9},
            {x : 0, y : 68, width : 1200, height : 68, frames : 10},
            {x : 0, y : 136, width : 600, height : 68, frames : 5}];

        console.log(strips);
        expect(strips[0]).to.deep.equal(expected);
    });
    it('should return thumbs from 15 to 16', () => {
        const strips = thumbs.stripsForFrames(15, 16);
        const expected = [{x : 600, y : 68, width : 240, height : 68, frames : 2}];

        console.log(strips);
        expect(strips[0]).to.deep.equal(expected);
    });
    it('should return thumbs from 16 to 33', () => {
        const strips = thumbs.stripsForFrames(16, 33);
        const expected = [{x : 720, y : 68, width : 480, height : 68, frames : 4},
            {x : 0, y : 136, width : 1200, height : 68, frames : 10},
            {x : 0, y : 204, width : 480, height : 68, frames : 4}];

        console.log(strips);
        expect(strips[0]).to.deep.equal(expected);
    });
    it('should return thumbs from 239 to 240', () => {
        const strips = thumbs.stripsForFrames(239, 240);
        const expected = {
            0 : [{x : 1080, y : 1564, width : 120, height : 68, frames : 1}],
            1 : [{x : 0, y : 0, width : 120, height : 68, frames : 1}]
        };

        console.log(strips);
        expect(strips).to.deep.equal(expected);
    });
    it('should return board number 3', () => {
        const strips = thumbs.stripsForFrames(720, 721);
        const expected = [{x : 0, y : 0, width : 240, height : 68, frames : 2}];

        console.log(strips);
        expect(strips[3]).to.deep.equal(expected);
    });
    it('should return board number 7', () => {
        const strips = thumbs.stripsForFrames(1811, 1812);
        const expected = [{x : 0, y : 0, width : 240, height : 68, frames : 2}];

        console.log(strips);
        expect(strips[7]).to.deep.equal(expected);
    });

});

