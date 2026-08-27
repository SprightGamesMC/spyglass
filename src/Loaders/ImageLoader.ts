import type { ImageReadResult } from "../Types/LoaderTypes.js";
import type { Storage } from "../Types/StorageTypes.js";
import ImageMetadataReader from "./ImageMetadataReader.js";
import PromiseCache from "./PromiseCache.js";

export default class ImageLoader {
    private readonly storage: Storage;
    private readonly cache = new PromiseCache<ImageReadResult>();

    constructor(storage: Storage) {
        this.storage = storage;
    }

    read(path: string): Promise<ImageReadResult> {
        return this.cache.get(path, () => this.load(path));
    }

    private async load(path: string): Promise<ImageReadResult> {
        let bytes: Uint8Array;

        try {
            bytes = await this.storage.readBytes(path);
        } catch {
            return { status: "unreadable" };
        }

        const metadata = ImageMetadataReader.read(bytes);

        if (metadata === undefined) {
            return { status: "invalid" };
        }

        return { status: "ok", metadata };
    }
}
