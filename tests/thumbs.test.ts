import 'mocha';
import {expect} from 'chai';
import ThumbsStrip, {Strip} from "../src/model/ThumbsStrip";
import {flatten} from "../src/utils/ArrayUtils";

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
        const expected = [{x : 120, y : 884, width : 240, height : 68, frames : 2}];

        console.log(strips);
        expect(strips[7]).to.deep.equal(expected);
    });

    it('should render 3 rows', function () {
        const strips: { [page: number]: Strip[] } = {
            '8' :
                [{x : 480, width : 720, y : 340, height : 68, frames : 6},
                    {x : 0, width : 1200, y : 408, height : 68, frames : 10}],
            '9' : [{x : 0, width : 960, y : 0, height : 68, frames : 8}]
        };

        /*
           a [ { x: 480, width: 720, y: 340, height: 68, frames: 6 },
           b      { x: 0, width: 1200, y: 408, height: 68, frames: 10 },
           c      { x: 0, width: 960, y: 476, height: 68, frames: 8 } ]
            ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            24 frames total / 10 frames in column

            ①
            -------- 6 frames in the first row
            draw a.frames
            dx = 0
            dy = 68 * 0

            -------- + 4 frames in this row
            offset = (10 - a.frames) // 4
            draw offset from b{0-3} in the first row
            dx = 120 * 6
            dy = 0

            ②
            -------- 6 frames in the second row
            offset = (b - offset) //6
            draw offset from b{4-9} in the second row
            dx = 0
            dy = 68 * 1

            -------- + 4 frames in this row
            offset = (c - offset)
            draw offset from c{0-3} in the second row
            dx = 120 * 6
            dy = 68 * 1
            ③

            -------- 4 frames in this row
            offset = (c - offset)
            draw offset from c{4-7} in the second row
            dx = 120 * 6
            dy = 68 * 2
        */

        let offset = {x : 0, y : 0};
        const board1 = thumbs.stripsToCanvas(strips[8], offset);
        console.log(board1);

        let offset1 = {x : 720, y : 68};
        const board2 = thumbs.stripsToCanvas(strips[9], offset1);
        console.log(board2);

        const expected = [
            {x : 0, y : 0, width : 720, height : 68, frames : 6},
            {x : 720, y : 0, width : 480, height : 68, frames : 4},
            {x : 0, y : 68, width : 720, height : 68, frames : 6},
            {x : 720, y : 68, width : 480, height : 68, frames : 4},
            {x : 0, y : 136, width : 480, height : 68, frames : 4},
        ];

        let actual = flatten([...board1.values(), ...board2.values()]);
        expect(actual).to.deep.equal(expected);
    });

    it('should render 2 rows with offset', function () {
        const strips: { [page: number]: Strip[] } = {
            '0' : [{x : 0, width : 480, y : 0, height : 68, frames : 4}],
        };
        let offset = {x : 8 * 120, y : 68 * 3};
        let stripsToCanvas = thumbs.stripsToCanvas(strips[0], offset);
        let actual = flatten([...stripsToCanvas.values()]);

        const expected = [
            {x : 8 * 120, y : 68 * 3, width : 120 * 2, height : 68, frames : 2},
            {x : 0, y : 68 * 4, width : 120 * 2, height : 68, frames : 2}
        ];
        expect(actual).to.deep.equal(expected);
    });

    it('should render 24 frames from 2 pages', function () {
        const boards: { [page: number]: Strip[] } = {
            '8' :
                [{x : 480, width : 720, y : 340, height : 68, frames : 6},
                    {x : 0, width : 1200, y : 408, height : 68, frames : 10}],
            '9' : [{x : 0, width : 960, y : 0, height : 68, frames : 8}]
        };

        console.log(boards);
        let offset = {x : 0, y : 0};
        let actual: any[] = [];

        for (const page in boards) {
            let strips = boards[page];

            let stripsToCanvas = thumbs.stripsToCanvas(strips, offset);
            let lastStrip = stripsToCanvas.get(strips[strips.length - 1]);
            let lastCanvasStrip = lastStrip[lastStrip.length - 1];

            offset = {x : lastCanvasStrip.x + lastCanvasStrip.width, y : lastCanvasStrip.y};

            console.log(lastCanvasStrip);
            actual = actual.concat([...stripsToCanvas.values()]);
        }

        const expected = [
            {x : 0, y : 0, width : 720, height : 68, frames : 6},
            {x : 720, y : 0, width : 480, height : 68, frames : 4},
            {x : 0, y : 68, width : 720, height : 68, frames : 6},
            {x : 720, y : 68, width : 480, height : 68, frames : 4},
            {x : 0, y : 136, width : 480, height : 68, frames : 4},
        ];

        expect(flatten(actual)).to.deep.equal(expected);
    });

    it('should go to next row if offset.x = 1200', function () {
        let actual = thumbs.stripsToCanvas([{x : 480, width : 720, y : 340, height : 68, frames : 6}], {
            x : 1200,
            y : 0
        });
        const expected = [{x : 0, y : 68, width : 720, height : 68, frames : 6}];
        expect(flatten([...actual.values()])).to.deep.equal(expected);
    });

    it('should render 24 rows', function () {
        const boards = thumbs.stripsForFrames(0, 240);
        let offset = {x : 0, y : 0};
        for (const page in boards) {
            let strips = boards[page];

            let stripsToCanvas = thumbs.stripsToCanvas(strips, offset);
            let lastStrip = stripsToCanvas.get(strips[strips.length - 1]);
            let lastCanvasStrip = lastStrip[lastStrip.length - 1];

            offset = {x : lastCanvasStrip.x + lastCanvasStrip.width, y : lastCanvasStrip.y};
            console.log(stripsToCanvas);
        }
    });

    it('should render 2 rows', function () {
        const boards = thumbs.stripsForFrames(1811, 1811 + 13);
        let offset = {x : 0, y : 0};
        for (const page in boards) {
            let strips = boards[page];

            let stripsToCanvas = thumbs.stripsToCanvas(strips, offset);
            let lastStrip = stripsToCanvas.get(strips[strips.length - 1]);
            let lastCanvasStrip = lastStrip[lastStrip.length - 1];

            offset = {x : lastCanvasStrip.x + lastCanvasStrip.width, y : lastCanvasStrip.y};
            console.log(stripsToCanvas);
        }
    });

    it('should map source strips to destination rows', function () {
        let sourceStips = [
            {x : 3, y : 0, width : 4, height : 1, frames : 4},//s1
            {x : 0, y : 1, width : 7, height : 1, frames : 7},//s2
            {x : 0, y : 2, width : 2, height : 1, frames : 2},//s3
            {x : 2, y : 2, width : 5, height : 1, frames : 5},//s4
            {x : 0, y : 3, width : 3, height : 1, frames : 3},//s5
        ];
        let expected = [
            [   //s1
                [{x : 3, y : 0, width : 4, height : 1, frames : 4}, {x : 0, y : 0, width : 4, height : 1, frames : 4}],
                //s2
                [{x : 0, y : 1, width : 3, height : 1, frames : 3}, {x : 4, y : 0, width : 3, height : 1, frames : 3}]
            ],
            [   //s2
                [{x : 3, y : 1, width : 4, height : 1, frames : 4}, {x : 0, y : 1, width : 4, height : 1, frames : 4}],
                //s3
                [{x : 0, y : 2, width : 2, height : 1, frames : 2}, {x : 4, y : 1, width : 2, height : 1, frames : 2}],
                //s4
                [{x : 2, y : 2, width : 1, height : 1, frames : 1}, {x : 6, y : 1, width : 1, height : 1, frames : 1}]
            ],
            [   //s4
                [{x : 3, y : 2, width : 4, height : 1, frames : 4}, {x : 0, y : 2, width : 4, height : 1, frames : 4}],
                //s5
                [{x : 0, y : 3, width : 3, height : 1, frames : 3}, {x : 4, y : 2, width : 3, height : 1, frames : 3}]
            ]
        ];
        const thumbs1 = new ThumbsStrip(7, 24, 1, 1);
        let rows = thumbs1.stripsMapToRows(sourceStips, 7);
        // console.log(rows[0]);
        expect([...rows[0]]).to.deep.equal(expected[0]);
        // console.log(rows[1]);
        expect([...rows[1]]).to.deep.equal(expected[1]);
        console.log(rows[2]);
        expect([...rows[2]]).to.deep.equal(expected[2]);
    });

    it('should calculate page number for a frame number', function () {
        let page = thumbs.pageForFrame(239);
        expect(page).to.equal(0);
        let page1 = thumbs.pageForFrame(240);
        expect(page1).to.equal(1);
    });
});

describe('frames to canvas', function () {
    const thumbstrip = new ThumbsStrip(10, rows, 1, 1);

    it('should map frames to canvas', function () {
        let startFrame = 34;
        let length = 18;
        let expected = [
            //r0
            [
                //s1.1
                [{x : 4, y : 3, width : 6, height : 1, frames : 6, startFrame : 34}, {x : 0, y : 0, width : 6, height : 1, frames : 6}],
                //s2.1
                [{x : 0, y : 4, width : 4, height : 1, frames : 4, startFrame : 40}, {x : 6, y : 0, width : 4, height : 1, frames : 4}],
            ],
            [
                //s2.2
                [{x : 4, y : 4, width : 6, height : 1, frames : 6, startFrame : 44}, {x : 0, y : 1, width : 6, height : 1, frames : 6}],
                //s3.1
                [{x : 0, y : 5, width : 2, height : 1, frames : 2, startFrame : 50}, {x : 6, y : 1, width : 2, height : 1, frames : 2}]
            ]
        ];
        let rows = thumbstrip.framesToCanvas(startFrame, length, 10);
        console.log(rows);
        expect([...rows[0]]).to.deep.equal(expected[0]);
        expect([...rows[1]]).to.deep.equal(expected[1]);
    });
    it('should map 1 frame in src to 1 frame in dest', function () {
        let startFrame = 42;
        let expected = [
            [
                [{x : 2, y : 4, width : 1, height : 1, frames : 1, startFrame : 42}, {x : 0, y : 0, width : 1, height : 1, frames : 1}],
            ]
        ];
        let rows = thumbstrip.framesToCanvas(startFrame, 1, 10);
        console.log(rows);
        expect([...rows[0]]).to.deep.equal(expected[0]);
    });

    it('should map 2 src rows to 1 dest row', function () {
        let startFrame = 1058;
        let length = 4;
        let expected = [
            [
                [{x : 8, y : 9, width : 2, height : 1, frames : 2, startFrame : 1058}, {x : 0, y : 0, width : 2, height : 1, frames : 2}],
                [{x : 0, y : 10, width : 2, height : 1, frames : 2, startFrame : 1060}, {x : 2, y : 0, width : 2, height : 1, frames : 2}]
            ]
        ];
        let rows = thumbstrip.framesToCanvas(startFrame, length, 10);
        console.log(rows);
        expect([...rows[0]]).to.deep.equal(expected[0]);
    });

    it('should render frames from 1825 to 1831', function () {
        let startFrame = 1825;
        let length = 7;
        let rows = thumbstrip.framesToCanvas(startFrame, length, 10);
        console.log(rows);
        let expected = [
            [
                [{ x: 5, y: 14, width: 5, height: 1, frames: 5, startFrame: 1825 }, { x: 0, y: 0, width: 5, height: 1, frames: 5 }],
                [{ x: 0, y: 15, width: 2, height: 1, frames: 2, startFrame: 1830 }, { x: 5, y: 0, width: 2, height: 1, frames: 2 }]
            ]
        ];
        expect([...rows[0]]).to.deep.equal(expected[0]);
    });
});
