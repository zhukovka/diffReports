class DiffReportsApi {
    private imageMap: Map<string, ImageBitmap> = new Map();

    constructor (private projectId: string) {

    }

    getImage (videoId: string, page: number): Promise<ImageBitmap> {
        let padStart = String(page + 1).padStart(3, '0');

        const imgSrc = `${videoId}/stripes/out${padStart}.jpg`;
        return new Promise((resolve, reject) => {
            if (this.imageMap.has(imgSrc)) {
                resolve(this.imageMap.get(imgSrc));
            } else {
                fetch(imgSrc).then(res => res.blob()).then(blob => {
                    return createImageBitmap(blob);
                }).then(img => {
                    this.imageMap.set(imgSrc, img);
                    resolve(img);
                }).catch(reject);
            }
        });
    }
}

export default DiffReportsApi;