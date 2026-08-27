import type Loaders from "../../Loaders/Loaders.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import type { ArtFile } from "../../Types/ModelTypes.js";
import ArtLimits from "./ArtLimits.js";

export default abstract class ArtImages {
    static async read(loaders: Loaders, file: ArtFile): Promise<ImageMetadata | undefined> {
        const result = await loaders.image.read(file.path);

        return result.status === "ok" ? result.metadata : undefined;
    }

    static dpiMatches(metadata: ImageMetadata, expected: number): boolean {
        return ArtImages.dpiValueMatches(metadata.horizontalDpi, expected) && ArtImages.dpiValueMatches(metadata.verticalDpi, expected);
    }

    static describeDpi(metadata: ImageMetadata): string {
        if (metadata.horizontalDpi === undefined || metadata.verticalDpi === undefined) {
            return "missing";
        }

        return ArtImages.formatDpi(metadata.horizontalDpi) + " by " + ArtImages.formatDpi(metadata.verticalDpi);
    }

    static describeSize(metadata: ImageMetadata): string {
        return metadata.width + " by " + metadata.height;
    }

    private static dpiValueMatches(value: number | undefined, expected: number): boolean {
        return value !== undefined && Math.abs(value - expected) <= ArtLimits.DPI_TOLERANCE;
    }

    private static formatDpi(value: number): string {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
}
