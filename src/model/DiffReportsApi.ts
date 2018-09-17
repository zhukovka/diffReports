class DiffReportsApi {
    private imageMap: Map<string, HTMLImageElement> = new Map();

    constructor (private projectId: string) {

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