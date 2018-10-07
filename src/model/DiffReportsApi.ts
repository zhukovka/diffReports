import {graphql, buildSchema, GraphQLSchema} from 'graphql';
import {Db} from "indexed-mongo/dist/Db";
import {IndexedClient} from "indexed-mongo/dist/IndexedClient";

interface DiffContext {
    db?: Db
}

const DiffResolver = {
    ranges (args: any, context: DiffContext, info: any) {
        return context.db.collection("ranges").then(c => c.find().toArray())
    }
};

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type IRange {
    frame: Int
    length: Int
}
type DiffRange {
    r1: IRange
    r2: IRange
    movedTo: IRange
    matchType: String
}
type Query {
  ranges: [DiffRange]!
}
`);

const context: DiffContext = {};

// const worker = new Worker("worker.bundle.js");
// console.log("DiffResolver ranges worker");
// worker.onmessage = (e) => {
//     console.log("message", e);
// };

class DiffReportsApi {
    private imageMap: Map<string, HTMLImageElement> = new Map();

    constructor (private projectId: string) {
        // The root provides a resolver function for each API endpoint
    }

    query (q: string) {
        if (!context.db) {
            return IndexedClient.connect(this.projectId).then((db) => {
                context.db = db;
                return graphql(schema, q, DiffResolver, context);
            });
        }
        return graphql(schema, q, DiffResolver, context)
    }

    getImage (videoId: string, page: number): Promise<HTMLImageElement> {
        let padStart = String(page + 1).padStart(3, '0');

        const imgSrc = `${videoId}/stripes/out${padStart}.jpg`;
        return new Promise((resolve, reject) => {
            let img: HTMLImageElement;

            if (this.imageMap.has(imgSrc)) {
                img = this.imageMap.get(imgSrc);
                resolve(img);
            } else {
                img = new Image();
                img.src = imgSrc;
                img.onload = () => {
                    resolve(img);
                    this.imageMap.set(img.src, img);
                };
                img.onerror = reject;
            }
        });
    }
}

export default DiffReportsApi;