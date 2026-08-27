import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtFolderMissingCheck from "./ArtFolderMissingCheck.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreArtFolderMissing extends ArtFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_ART_FOLDER_MISSING,
        slug: "store-art-folder-missing",
        severity: "error",
        description: "No Store Art folder at the root",
    };

    protected folder(): ArtFolder {
        return ArtLimits.STORE_FOLDER;
    }
}
