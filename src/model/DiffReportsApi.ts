import {DiffResponse, MessageType, QueryResponse} from "./DiffMessage";

type Resolver<T> = (value?: T | PromiseLike<T>) => void;

class DiffReportsApi {
    private imageMap: Map<string, HTMLImageElement> = new Map();
    private queryQueue: Map<string, Array<Resolver<DiffResponse>>> = new Map();
    private worker: Worker;

    constructor (private projectId: string) {
        console.log("DiffResolver ranges worker");
        this.worker = new Worker("worker.bundle.js");
        this.worker.onmessage = (e) => {
            console.log("message", e);
            this.sendResponse(e.data);
        };
        this.worker.postMessage({type : MessageType.CONTEXT, dbName : projectId});
    }

    sendResponse (response: DiffResponse) {
        console.log(response);
        switch (response.type) {
            case MessageType.QUERY:
                return this.resolveQuery(response as QueryResponse);
        }
    }

    private resolveQuery ({query, result}: QueryResponse) {
        //get all matching query resolvers from the queue
        const resolvers = this.queryQueue.get(query);
        //resolve all matching query promises
        for (const resolve of resolvers) {
            resolve(result);
        }
        //clear the queue of matching query resolvers
        this.queryQueue.delete(query);
    }


    query (q: string): Promise<QueryResponse> {
        if (!this.queryQueue.has(q)) {
            this.queryQueue.set(q, []);
            this.worker.postMessage({type : MessageType.QUERY, query : q});
        }
        return new Promise(resolve => {
            this.queryQueue.get(q).push(resolve);
        });
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