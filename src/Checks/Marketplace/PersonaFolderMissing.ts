import type { CheckDefinition } from "../../Types/CheckTypes.js";
import MarketplaceFolderMissingCheck from "./MarketplaceFolderMissingCheck.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class PersonaFolderMissing extends MarketplaceFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PERSONA_FOLDER_MISSING,
        slug: "persona-folder-missing",
        severity: "error",
        description: "No Content/persona folder",
        contentTypes: ["persona"],
    };

    protected expectedFolder(): string {
        return MarketplaceFolders.contentPath(MarketplaceLimits.PERSONA_FOLDER);
    }
}
