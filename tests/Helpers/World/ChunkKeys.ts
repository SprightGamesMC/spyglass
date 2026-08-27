import type { ChunkKeyOptions } from "../../Types/World/WorldFixtureTypes.js";

export default abstract class ChunkKeys {
    static build(options: ChunkKeyOptions): Uint8Array {
        const hasDimension = options.dimension !== undefined;
        const hasSubChunk = options.subChunk !== undefined;
        const bytes = new Uint8Array(8 + (hasDimension ? 4 : 0) + 1 + (hasSubChunk ? 1 : 0));
        const view = new DataView(bytes.buffer);
        let offset = 0;

        view.setInt32(offset, options.x, true);
        offset += 4;
        view.setInt32(offset, options.z, true);
        offset += 4;

        if (options.dimension !== undefined) {
            view.setInt32(offset, options.dimension, true);
            offset += 4;
        }

        bytes[offset] = options.tag;
        offset += 1;

        if (options.subChunk !== undefined) {
            bytes[offset] = options.subChunk;
        }

        return bytes;
    }
}
