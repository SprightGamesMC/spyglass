import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class BlockbenchProjectMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.BLOCKBENCH_PROJECT_MISSING,
        slug: "blockbench-project-missing",
        severity: "error",
        description: "No Blockbench project file",
        contentTypes: ["persona"],
    };

    protected role(): ArtRole {
        return "blockbench_project";
    }

    protected folder(): ArtFolder {
        return ArtLimits.MARKETING_FOLDER;
    }

    protected expectedName(): string {
        return "id" + ArtLimits.BLOCKBENCH_PROJECT_SUFFIX + "." + ArtLimits.BLOCKBENCH_PROJECT_EXTENSION;
    }
}
