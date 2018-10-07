import {DiffRange} from "bigfootjs/dist/DiffRange";
import {IVideo} from "bigfootjs/dist/Video";
import {IndexedClient} from "indexed-mongo/dist/IndexedClient";
let id;
const worker: Worker = self as any;
onmessage = (e) => {
    console.log(e);
    if (e.data.type == "INITIAL") {
        const {ranges, comparedVideo, sourceVideo, projectId} = e.data;
        id = projectId;
        IndexedClient.connect(projectId).then(function (db) {
            console.log(db.version);
            if (db.version == 1) {
                // Create a collection
                Promise.all([
                    db.createCollection("ranges").then(function (collection) {
                        // Insert a document in the collection
                        collection.insertMany(ranges).then(function (r) {
                            console.log("ranges", r);
                        });
                    }),
                    db.createCollection("videos").then(collection => {
                        collection.insertMany([comparedVideo, sourceVideo]).then(function (r) {
                            console.log("videos", r);
                        });
                    })
                ]).then(res => {
                    // db.close();
                    worker.postMessage({result : res});
                    // db.collection("another_collection").then(c => {
                    //     c.find().toArray().then(values => {
                    //         console.log(values);
                    //     })
                    // })
                });
            } else {
                worker.postMessage({result : "ok"});
            }
        });
    }
};
