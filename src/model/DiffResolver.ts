import {IDb} from "indexed-mongo/dist/Db";

export interface DiffContext {
    db?: IDb
}

export const DiffResolver = {
    ranges (args: any, context: DiffContext, info: any) {
        const col = context.db.collection("ranges");
        return col.find().toArray()
    }
};

