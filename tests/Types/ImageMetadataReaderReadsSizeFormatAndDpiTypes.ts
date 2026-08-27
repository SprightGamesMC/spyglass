import type { ImageMetadata } from "../../src/Types/LoaderTypes.js";

export interface ImageCase {
    readonly name: string;
    readonly bytes: Uint8Array;
    readonly expected: ImageMetadata | undefined;
}
