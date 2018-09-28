// \d{2}$
import 'mocha';
import {expect} from 'chai';
import {MatchType} from "../src/model/DiffRange";

let ranges = [
    {"r1" : {"frame" : 0, "length" : 0}, "r2" : {"frame" : 0, "length" : 2181}, "matchType" : MatchType.ADDED},
    {"r1" : {"frame" : 0, "length" : 140}, "r2" : {"frame" : 2182, "length" : 140}, "matchType" : MatchType.MATCH},
    {
        "r1" : {"frame" : 1030, "length" : 597},
        "r2" : {"frame" : 3214, "length" : 1564},
        "matchType" : MatchType.CHANGED
    },
    {
        "r1" : {"frame" : 1648, "length" : 432},
        "r2" : {"frame" : 4778, "length" : 0},
        "matchType" : MatchType.REMOVED
    },
    {
        "r1" : {"frame" : 1627, "length" : 21},
        "r2" : {"frame" : 4778, "length" : 0},
        "movedTo" : {"frame" : 14801, "length" : 21},
        "matchType" : MatchType.MOVED_FROM
    }
];
describe('digits padding function', () => {
    const SHORT_EVENT_FRAMES = 4;
    it('should pad digits with zeros', function () {
        const expected = '0042';
        // @ts-ignore
        let actual = '42'.padStart(4, '0');
        console.log(actual);
        expect(actual).to.equal(expected)
    });

    it('should test for a short event', () => {
        let {r1, r2} = ranges[0];
        let shortEvents = false;
                    //false || (true||false) -> true
        let short = shortEvents || !(r1.length > SHORT_EVENT_FRAMES || r2.length > SHORT_EVENT_FRAMES);

        expect(short).to.be.false
    })
});