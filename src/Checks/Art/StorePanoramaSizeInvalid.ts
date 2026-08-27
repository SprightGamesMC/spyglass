import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StorePanoramaSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_PANORAMA_SIZE_INVALID,
        slug: "store-panorama-size-invalid",
        severity: "error",
        description:
            "Store panorama height is not " +
            ArtLimits.STORE_PANORAMA_HEIGHT +
            " or width is outside " +
            ArtLimits.STORE_PANORAMA_MIN_WIDTH +
            " to " +
            ArtLimits.STORE_PANORAMA_MAX_WIDTH,
        excludedContentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.role === "panorama";
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return (
            metadata.height === ArtLimits.STORE_PANORAMA_HEIGHT &&
            metadata.width >= ArtLimits.STORE_PANORAMA_MIN_WIDTH &&
            metadata.width <= ArtLimits.STORE_PANORAMA_MAX_WIDTH
        );
    }

    protected expectedSize(): string {
        return ArtLimits.STORE_PANORAMA_MIN_WIDTH + " to " + ArtLimits.STORE_PANORAMA_MAX_WIDTH + " by " + ArtLimits.STORE_PANORAMA_HEIGHT;
    }
}
