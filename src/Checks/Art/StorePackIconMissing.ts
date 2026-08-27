import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class StorePackIconMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_PACK_ICON_MISSING,
        slug: "store-pack-icon-missing",
        severity: "error",
        description: "No store pack icon file",
        excludedContentTypes: ["skin", "persona"],
    };

    protected role(): ArtRole {
        return "pack_icon";
    }

    protected folder(): ArtFolder {
        return ArtLimits.STORE_FOLDER;
    }

    protected expectedName(): string {
        return "name" + ArtLimits.PACK_ICON_SUFFIX + ArtLimits.FIRST_INDEX + "." + ArtLimits.JPG_EXTENSION;
    }
}
