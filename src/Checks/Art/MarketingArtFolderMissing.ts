import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtFolderMissingCheck from "./ArtFolderMissingCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class MarketingArtFolderMissing extends ArtFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_ART_FOLDER_MISSING,
        slug: "marketing-art-folder-missing",
        severity: "error",
        description: "No Marketing Art folder at the root",
    };

    protected folder(): ArtFolder {
        return ArtLimits.MARKETING_FOLDER;
    }
}
