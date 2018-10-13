import {DiffResponse, InitialMessage, QueryMessage} from "./DiffMessage";
import {IndexedClient} from "indexed-mongo/dist/IndexedClient";
import {buildSchema, ExecutionResult, graphql} from "graphql";
import {DiffContext, DiffResolver} from "./DiffResolver";

type Resolver<T> = (value?: T | PromiseLike<T>) => void;

class DiffWorker {
    private context: DiffContext = {};
    contextObservers: Array<Resolver<DiffContext>> = [];
    _contextUpdating: boolean;

    set contextUpdating (v: boolean) {
        if (!v) {
            this.contextObservers = [];
        }
        this._contextUpdating = v;
    }

    waitForContext (): Promise<DiffContext> {
        if (!this._contextUpdating) {
            return Promise.resolve(this.context);
        }
        return new Promise<DiffContext>(resolve => this.contextObservers.push(resolve))
    }

    executeQuery (msg: QueryMessage): Promise<ExecutionResult> {
        return this.waitForContext().then((context) => graphql(schema, msg.query, DiffResolver, context));
        // if (!this.context.db) {
        //     //wait for context db
        //     return;
        // }
        // return graphql(schema, msg.query, DiffResolver, context);
    }

    initialWrite (msg: InitialMessage): Promise<any> {
        const {ranges, comparedVideo, sourceVideo, projectId} = msg;
        return IndexedClient.connect(projectId).then((db) => {
            console.log(db.version);
            if (db.version == 1) {
                // Create a collection
                return Promise.all([
                    db.createCollection("ranges").then((collection) => {
                        // Insert a document in the collection
                        collection.insertMany(ranges).then((r) => {
                            console.log("ranges", r);
                        });
                    }),
                    db.createCollection("videos").then(collection => {
                        collection.insertMany([comparedVideo, sourceVideo]).then((r) => {
                            console.log("videos", r);
                        });
                    })
                ]).then(() => ({result : "ok"}));
            }
            else {
                return Promise.resolve({result : "ok"});
            }
        });
    }

    private updateContext (partialContext: Promise<DiffContext>): Promise<DiffContext> {
        this.contextUpdating = true;
        return new Promise<DiffContext>(resolve => {
            partialContext.then(ctx => {
                Object.assign(this.context, ctx);
                for (const observer of this.contextObservers) {
                    observer(this.context);
                }
                this.contextUpdating = false;
                resolve(this.context);
            });
        })
    }


    createContext (dbname: string): Promise<DiffContext> {
        return this.updateContext(IndexedClient.connect(dbname).then((db) => {
            return {db};
        }));
    }
}


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


export default DiffWorker;