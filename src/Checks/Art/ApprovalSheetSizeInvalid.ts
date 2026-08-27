import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtImageSizeCheck from "./ArtImageSizeCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class ApprovalSheetSizeInvalid extends ArtImageSizeCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.APPROVAL_SHEET_SIZE_INVALID,
        slug: "approval-sheet-size-invalid",
        severity: "error",
        description: "Approval sheet is not " + ArtLimits.APPROVAL_SHEET_WIDTH + " by " + ArtLimits.APPROVAL_SHEET_HEIGHT,
        contentTypes: ["persona"],
    };

    protected selects(entry: ClassifiedArtFile): boolean {
        return entry.role === "approval_sheet";
    }

    protected sizeIsValid(metadata: ImageMetadata): boolean {
        return metadata.width === ArtLimits.APPROVAL_SHEET_WIDTH && metadata.height === ArtLimits.APPROVAL_SHEET_HEIGHT;
    }

    protected expectedSize(): string {
        return ArtLimits.APPROVAL_SHEET_WIDTH + " by " + ArtLimits.APPROVAL_SHEET_HEIGHT;
    }
}
