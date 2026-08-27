import type { CheckDefinition } from "../../Types/CheckTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtDpiCheck from "./ArtDpiCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class MarketingArtDpiInvalid extends ArtDpiCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_ART_DPI_INVALID,
        slug: "marketing-art-dpi-invalid",
        severity: "error",
        description: ArtLimits.MARKETING_FOLDER + " file is not " + ArtLimits.MARKETING_DPI + " DPI",
        excludedContentTypes: ["persona"],
    };
    protected readonly folder = ArtLimits.MARKETING_FOLDER;
    protected readonly dpi = ArtLimits.MARKETING_DPI;
}
