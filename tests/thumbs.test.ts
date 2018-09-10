import 'mocha';
import {expect} from 'chai';
import ThumbsStrip from "../src/model/ThumbsStrip";

const cols = 10;
const rows = 24;
//120*68
const width = 120;
const height = 68;
const thumbs = new ThumbsStrip(cols, rows, width, height);
const ranges = [
    {
        "r1" : {"frame" : 0, "length" : 0},
        "r2" : {"frame" : 0, "length" : 4}, "matchType" : "ADDED"
    },
    {
        "r1" : {"frame" : 0, "length" : 1811},
        "r2" : {"frame" : 4, "length" : 1811}, "matchType" : "MATCH"
    },
    {
        "r1" : {"frame" : 1811, "length" : 0},
        "r2" : {"frame" : 1815, "length" : 31},
        "matchType" : "ADDED"
    },
    {
        "r1" : {"frame" : 1811, "length" : 14},
        "r2" : {"frame" : 1846, "length" : 0},
        "movedTo" : {"frame" : 1861, "length" : 14},
        "matchType" : "MOVED_FROM"
    },
    {
        "r1" : {"frame" : 1825, "length" : 7},
        "r2" : {"frame" : 1846, "length" : 7},
        "matchType" : "MATCH"
    }];

describe('frames to canvas', function () {
    const thumbstrip = new ThumbsStrip(10, rows, 1, 1);

    it('should map frames to canvas', function () {
        let startFrame = 34;
        let length = 18;
        let expected = [
            //r0
            [
                //s1.1
                [{x : 4, y : 3, width : 6, height : 1, frames : 6, startFrame : 34}, {
                    x : 0,
                    y : 0,
                    width : 6,
                    height : 1,
                    frames : 6
                }],
                //s2.1
                [{x : 0, y : 4, width : 4, height : 1, frames : 4, startFrame : 40}, {
                    x : 6,
                    y : 0,
                    width : 4,
                    height : 1,
                    frames : 4
                }],
            ],
            [
                //s2.2
                [{x : 4, y : 4, width : 6, height : 1, frames : 6, startFrame : 44}, {
                    x : 0,
                    y : 1,
                    width : 6,
                    height : 1,
                    frames : 6
                }],
                //s3.1
                [{x : 0, y : 5, width : 2, height : 1, frames : 2, startFrame : 50}, {
                    x : 6,
                    y : 1,
                    width : 2,
                    height : 1,
                    frames : 2
                }]
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
                [{x : 2, y : 4, width : 1, height : 1, frames : 1, startFrame : 42}, {
                    x : 0,
                    y : 0,
                    width : 1,
                    height : 1,
                    frames : 1
                }],
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
                [{x : 8, y : 9, width : 2, height : 1, frames : 2, startFrame : 1058}, {
                    x : 0,
                    y : 0,
                    width : 2,
                    height : 1,
                    frames : 2
                }],
                [{x : 0, y : 10, width : 2, height : 1, frames : 2, startFrame : 1060}, {
                    x : 2,
                    y : 0,
                    width : 2,
                    height : 1,
                    frames : 2
                }]
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
                [
                    {x : 5, y : 14, width : 5, height : 1, frames : 5, startFrame : 1825},
                    {x : 0, y : 0, width : 5, height : 1, frames : 5}
                ],
                [
                    {x : 0, y : 15, width : 2, height : 1, frames : 2, startFrame : 1830},
                    {x : 5, y : 0, width : 2, height : 1, frames : 2}
                ]
            ]
        ];
        expect([...rows[0]]).to.deep.equal(expected[0]);
    });

    it('should draw from 9th frame', function () {
        let startFrame = 9;
        let length = 10;
        let rows = thumbstrip.framesToCanvas(startFrame, length, 10);
        console.log(rows);
        let expected = [
            [
                {x : 9, y : 0, width : 1, height : 1, frames : 1, startFrame : 9},
                {x : 0, y : 0, width : 1, height : 1, frames : 1}
            ],
            [
                {x : 0, y : 1, width : 9, height : 1, frames : 9, startFrame : 10},
                {x : 1, y : 0, width : 9, height : 1, frames : 9}
            ]
        ];
        expect([...rows[0]]).to.deep.equal(expected);
    });

    it('should draw 31 frames from 1815', function () {
        let range = {
            frame : 1815,
            length : 31
        };

        let rows = thumbstrip.framesToCanvas(range.frame, range.length, 10);
        console.log(rows);
    });
});

describe('timeline test', function () {
    it('should return map diffrange - range', function () {
        let timelineMap = thumbs.diffRangesToTimeline(ranges as any);

        let expected = [
            {frame : 0, length : 4},
            {frame : 4, length : 1811},
            {frame : 1815, length : 31},
            {frame : 1846, length : 14},
            {frame : 1860, length : 7}
        ];

        expect([...timelineMap.values()]).to.deep.equal(expected);
    });
});