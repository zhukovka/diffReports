import {DiffResponse, InitialMessage, QueryMessage} from "./DiffMessage";
import {IndexedClient} from "indexed-mongo/dist/IndexedClient";
import {buildSchema, ExecutionResult, graphql, GraphQLSchema} from "graphql";
import {DiffContext, DiffResolver} from "./DiffResolver";

type Resolver<T> = (value?: T | PromiseLike<T>) => void;

class DiffWorker {
    private context: DiffContext = {};
    contextObservers: Array<Resolver<DiffContext>> = [];
    _contextUpdating: boolean;
    private _schema: GraphQLSchema;

    constructor (private schemaUrl: string) {
    }


    set contextUpdating (v: boolean) {
        if (!v) {
            this.contextObservers = [];
        }
        this._contextUpdating = v;
    }

    waitForContext (): Promise<DiffContext> {
        if (!this._contextUpdating && this._schema) {
            return Promise.resolve(this.context);
        }
        return new Promise<DiffContext>(resolve => this.contextObservers.push(resolve))
    }

    executeQuery (msg: QueryMessage): Promise<ExecutionResult> {
        return Promise.all([this.waitForContext(), this.getSchema()])
            .then(([context, schema]: [DiffContext, GraphQLSchema]) => {
                return graphql(schema, msg.query, DiffResolver, context);
            });
        // return this.waitForContext().then((context) => {
        //     return this.getSchema().then(schema => {
        //         return graphql(schema, msg.query, DiffResolver, context);
        //     })
        // });
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

    getSchema (): Promise<GraphQLSchema> {
        if (this._schema) {
            return Promise.resolve(this._schema);
        } else {
            return fetch(this.schemaUrl)
                .then(res => res.text())
                .then(schema => {
                    // Construct a schema, using GraphQL schema language
                    this._schema = buildSchema(schema);
                    return this._schema;
                })
        }
    }

    createContext (dbname: string): Promise<DiffContext> {
        return this.updateContext(IndexedClient.connect(dbname).then((db) => {
            return {db};
        }));
    }
}


export default DiffWorker;