import type { ArtNameKind, ArtRole } from "../../Types/ArtTypes.js";
import type { CheckContext, CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import PersonaIdentifierLoader from "../../Loaders/PersonaIdentifierLoader.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class StoreThumbnailMissing extends ArtRoleMissingCheck {
    static readonly EXPECTED_NAMES: Readonly<Record<ArtNameKind, string>> = {
        standard: "name" + ArtLimits.THUMBNAIL_SUFFIX + ArtLimits.FIRST_INDEX + "." + ArtLimits.JPG_EXTENSION,
        persona: "id" + ArtLimits.THUMBNAIL_SUFFIX + ArtLimits.FIRST_INDEX + "." + ArtLimits.PNG_EXTENSION,
        emote: "id" + ArtLimits.THUMBNAIL_SUFFIX.toLowerCase() + ArtLimits.FIRST_INDEX + "." + ArtLimits.PNG_EXTENSION,
    };

    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_THUMBNAIL_MISSING,
        slug: "store-thumbnail-missing",
        severity: "error",
        description: "No store thumbnail file",
    };

    protected role(): ArtRole {
        return "thumbnail";
    }

    protected folder(): ArtFolder {
        return ArtLimits.STORE_FOLDER;
    }

    protected async expectedName(context: CheckContext): Promise<string> {
        const identity = await PersonaIdentifierLoader.load(context);

        return StoreThumbnailMissing.EXPECTED_NAMES[ArtFileRoles.nameKind(identity)];
    }
}
