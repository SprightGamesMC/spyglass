import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";
import ArtRoleMissingCheck from "./ArtRoleMissingCheck.js";

export default class MarketingKeyArtMissing extends ArtRoleMissingCheck {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_KEY_ART_MISSING,
        slug: "marketing-key-art-missing",
        severity: "error",
        description: "No marketing key art file",
        excludedContentTypes: ["persona"],
    };

    protected role(): ArtRole {
        return "key_art";
    }

    protected folder(): ArtFolder {
        return ArtLimits.MARKETING_FOLDER;
    }

    protected expectedName(): string {
        return "Name" + ArtLimits.KEY_ART_SUFFIX + "." + ArtLimits.JPG_EXTENSION + " or ." + ArtLimits.PSD_EXTENSION;
    }
}
