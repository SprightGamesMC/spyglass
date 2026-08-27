import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import PersonaIdentifierLoader from "../../Loaders/PersonaIdentifierLoader.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class ApprovalSheetMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.APPROVAL_SHEET_MISSING,
        slug: "approval-sheet-missing",
        severity: "error",
        description: "No approval sheet file",
        contentTypes: ["persona"],
    };

    override async run(context: CheckContext): Promise<Finding[]> {
        const identity = await PersonaIdentifierLoader.load(context);

        if (ArtFileRoles.nameKind(identity) === "emote") {
            return [];
        }

        return super.run(context);
    }

    protected role(): ArtRole {
        return "approval_sheet";
    }

    protected folder(): ArtFolder {
        return ArtLimits.MARKETING_FOLDER;
    }

    protected expectedName(): string {
        return "id" + ArtLimits.APPROVAL_SHEET_SUFFIX + "." + ArtLimits.PNG_EXTENSION;
    }
}
