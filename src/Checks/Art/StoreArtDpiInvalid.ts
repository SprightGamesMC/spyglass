import type { CheckDefinition } from "../../Types/CheckTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtDpiCheck from "./ArtDpiCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreArtDpiInvalid extends ArtDpiCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_ART_DPI_INVALID,
        slug: "store-art-dpi-invalid",
        severity: "error",
        description: ArtLimits.STORE_FOLDER + " file is not " + ArtLimits.STORE_DPI + " DPI",
        excludedContentTypes: ["persona"],
    };
    protected readonly folder = ArtLimits.STORE_FOLDER;
    protected readonly dpi = ArtLimits.STORE_DPI;
}
