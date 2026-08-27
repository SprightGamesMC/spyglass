import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreScreenshotSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_SCREENSHOT_SIZE_INVALID,
        slug: "store-screenshot-size-invalid",
        severity: "error",
        description: "Store screenshot is not " + ArtLimits.STORE_SCREENSHOT_WIDTH + " by " + ArtLimits.STORE_SCREENSHOT_HEIGHT,
        excludedContentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.role === "store_screenshot";
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return metadata.width === ArtLimits.STORE_SCREENSHOT_WIDTH && metadata.height === ArtLimits.STORE_SCREENSHOT_HEIGHT;
    }

    protected expectedSize(): string {
        return ArtLimits.STORE_SCREENSHOT_WIDTH + " by " + ArtLimits.STORE_SCREENSHOT_HEIGHT;
    }
}
