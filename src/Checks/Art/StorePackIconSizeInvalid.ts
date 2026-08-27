import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StorePackIconSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_PACK_ICON_SIZE_INVALID,
        slug: "store-pack-icon-size-invalid",
        severity: "error",
        description: "Store pack icon is not " + ArtLimits.STORE_PACK_ICON_SIZE + " by " + ArtLimits.STORE_PACK_ICON_SIZE,
        excludedContentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.role === "pack_icon";
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return metadata.width === ArtLimits.STORE_PACK_ICON_SIZE && metadata.height === ArtLimits.STORE_PACK_ICON_SIZE;
    }

    protected expectedSize(): string {
        return ArtLimits.STORE_PACK_ICON_SIZE + " by " + ArtLimits.STORE_PACK_ICON_SIZE;
    }
}
