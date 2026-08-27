import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class StorePanoramaMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_PANORAMA_MISSING,
        slug: "store-panorama-missing",
        severity: "error",
        description: "No store panorama file",
        excludedContentTypes: ["skin", "persona"],
    };

    protected role(): ArtRole {
        return "panorama";
    }

    protected folder(): ArtFolder {
        return ArtLimits.STORE_FOLDER;
    }

    protected expectedName(): string {
        return "name" + ArtLimits.PANORAMA_SUFFIX + ArtLimits.FIRST_INDEX + "." + ArtLimits.JPG_EXTENSION;
    }
}
