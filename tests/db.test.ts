// \d{2}$
import 'mocha';
import {expect} from 'chai';
import {MatchType} from "bigfootjs/dist/DiffRange";
import {MongoClient} from "mongodb";
import {DiffResolver} from "../src/model/DiffResolver";
import {IDb} from "indexed-mongo/dist/Db";

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
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'test';
// Connect using MongoClient
describe('mongo db tests', () => {
    it('should get a collection', function () {
        // expect(actual).to.equal(expected)
        MongoClient.connect(url, function (err, client) {
            // Create a collection we want to drop later
            const col = client.db(dbName).collection('ranges');
            col.insertMany(ranges).then(res => {
                console.log(res);
                expect(res.insertedCount).equal(ranges.length);
                client.close();
            });
        });
    });

    it('should be compatible with Indexed mongo interface', function () {
        MongoClient.connect(url, function (err, client) {
            // Cast mongo db to indexed-mongo interface
            const db: IDb = client.db(dbName) as any;
            DiffResolver.ranges(null, {db}, "").then(res => {
                console.log(res);
                expect(res).to.be.ok
            })
        });
    });
});