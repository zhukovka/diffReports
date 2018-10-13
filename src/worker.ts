import {MessageType} from "./model/DiffMessage";
import DiffWorker from "./model/DiffWorker";

const worker: DiffWorker = new DiffWorker();


onmessage = (e) => {
    console.log(e.data);
    switch (e.data.type) {
        case MessageType.INITIAL:
            worker.initialWrite(e.data).then(res => {
                postMessage({result : res});
            });
            break;
        case MessageType.CONTEXT:
            worker.createContext(e.data.dbName).then(context => {
                postMessage({type : MessageType.CONTEXT});
            });
            break;
        case MessageType.QUERY:
            worker.executeQuery(e.data).then(res => {
                console.log(res);
                postMessage({type : MessageType.QUERY, result : res.data, query : e.data.query});
            });
            break;
    }
};
