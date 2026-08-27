import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class MarketingArtSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_ART_SIZE_INVALID,
        slug: "marketing-art-size-invalid",
        severity: "error",
        description: ArtLimits.MARKETING_FOLDER + " file is not " + ArtLimits.MARKETING_WIDTH + " by " + ArtLimits.MARKETING_HEIGHT,
        excludedContentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.file.folder === ArtLimits.MARKETING_FOLDER;
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return metadata.width === ArtLimits.MARKETING_WIDTH && metadata.height === ArtLimits.MARKETING_HEIGHT;
    }

    protected expectedSize(): string {
        return ArtLimits.MARKETING_WIDTH + " by " + ArtLimits.MARKETING_HEIGHT;
    }
}
