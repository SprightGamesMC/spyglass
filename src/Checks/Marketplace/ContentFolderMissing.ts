import type { CheckDefinition } from "../../Types/CheckTypes.js";
import MarketplaceFolderMissingCheck from "./MarketplaceFolderMissingCheck.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class ContentFolderMissing extends MarketplaceFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.CONTENT_FOLDER_MISSING,
        slug: "content-folder-missing",
        severity: "error",
        description: "No Content folder at the root",
    };

    protected expectedFolder(): string {
        return MarketplaceLimits.CONTENT_FOLDER;
    }
}
