import type { ImageMetadata } from "../../src/Types/LoaderTypes.js";
import type { ImageCase } from "../Types/ImageMetadataReaderReadsSizeFormatAndDpiTypes.js";
import ImageMetadataReader from "../../src/Loaders/ImageMetadataReader.js";
import ImageBytes from "./Core/ImageBytes.js";

export default abstract class ImageMetadataReaderReadsSizeFormatAndDpi {
    static readonly CASES: readonly ImageCase[] = [
        {
            name: "64 by 32 png with alpha and 72 dpi reads size alpha and dpi",
            bytes: ImageBytes.png({ width: 64, height: 32, dpi: 72 }),
            expected: { format: "png", width: 64, height: 32, hasAlpha: true, horizontalDpi: 72, verticalDpi: 72 },
        },
        {
            name: "16 by 16 png without alpha reads no alpha and no dpi",
            bytes: ImageBytes.png({ width: 16, height: 16, alpha: false }),
            expected: { format: "png", width: 16, height: 16, hasAlpha: false, horizontalDpi: undefined, verticalDpi: undefined },
        },
        {
            name: "800 by 450 jpeg at 300 dpi reads size and dpi",
            bytes: ImageBytes.jpeg({ width: 800, height: 450, dpi: 300 }),
            expected: { format: "jpeg", width: 800, height: 450, hasAlpha: false, horizontalDpi: 300, verticalDpi: 300 },
        },
        {
            name: "320 by 240 gif reads size with alpha and no dpi",
            bytes: ImageBytes.gif({ width: 320, height: 240 }),
            expected: { format: "gif", width: 320, height: 240, hasAlpha: true, horizontalDpi: undefined, verticalDpi: undefined },
        },
        {
            name: "128 by 128 tga reads size with alpha and no dpi",
            bytes: ImageBytes.tga({ width: 128, height: 128 }),
            expected: { format: "tga", width: 128, height: 128, hasAlpha: true, horizontalDpi: undefined, verticalDpi: undefined },
        },
        {
            name: "1920 by 1080 psd at 300 dpi reads size and dpi",
            bytes: ImageBytes.psd({ width: 1920, height: 1080, dpi: 300 }),
            expected: { format: "psd", width: 1920, height: 1080, hasAlpha: false, horizontalDpi: 300, verticalDpi: 300 },
        },
        {
            name: "plain text bytes are not an image so metadata is undefined",
            bytes: new TextEncoder().encode("hello"),
            expected: undefined,
        },
    ];

    static read(bytes: Uint8Array): ImageMetadata | undefined {
        return ImageMetadataReader.read(bytes);
    }

    static roundDpi(metadata: ImageMetadata | undefined): ImageMetadata | undefined {
        if (metadata === undefined) {
            return undefined;
        }

        return {
            ...metadata,
            horizontalDpi: metadata.horizontalDpi === undefined ? undefined : Math.round(metadata.horizontalDpi),
            verticalDpi: metadata.verticalDpi === undefined ? undefined : Math.round(metadata.verticalDpi),
        };
    }
}
