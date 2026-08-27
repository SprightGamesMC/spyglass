import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreThumbnailSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_THUMBNAIL_SIZE_INVALID,
        slug: "store-thumbnail-size-invalid",
        severity: "error",
        description: "Store thumbnail is not " + ArtLimits.STORE_THUMBNAIL_WIDTH + " by " + ArtLimits.STORE_THUMBNAIL_HEIGHT,
        excludedContentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.role === "thumbnail";
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return metadata.width === ArtLimits.STORE_THUMBNAIL_WIDTH && metadata.height === ArtLimits.STORE_THUMBNAIL_HEIGHT;
    }

    protected expectedSize(): string {
        return ArtLimits.STORE_THUMBNAIL_WIDTH + " by " + ArtLimits.STORE_THUMBNAIL_HEIGHT;
    }
}
