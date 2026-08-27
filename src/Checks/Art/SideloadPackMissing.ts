import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class SideloadPackMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.SIDELOAD_PACK_MISSING,
        slug: "sideload-pack-missing",
        severity: "error",
        description: "No SideLoad .mcpack file",
        contentTypes: ["persona"],
    };

    protected role(): ArtRole {
        return "sideload_pack";
    }

    protected folder(): ArtFolder {
        return ArtLimits.MARKETING_FOLDER;
    }

    protected expectedName(): string {
        return "id" + ArtLimits.SIDELOAD_SUFFIX + "." + ArtLimits.SIDELOAD_EXTENSION;
    }
}
