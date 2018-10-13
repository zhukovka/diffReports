import {Db} from "indexed-mongo/dist/Db";

export interface DiffContext {
    db?: Db
}

export const DiffResolver = {
    ranges (args: any, context: DiffContext, info: any) {
        return context.db.collection("ranges").then(c => c.find().toArray())
    }
};

