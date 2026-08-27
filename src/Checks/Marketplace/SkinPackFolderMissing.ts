import type { CheckDefinition } from "../../Types/CheckTypes.js";
import MarketplaceFolderMissingCheck from "./MarketplaceFolderMissingCheck.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class SkinPackFolderMissing extends MarketplaceFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.SKIN_PACK_FOLDER_MISSING,
        slug: "skin-pack-folder-missing",
        severity: "error",
        description: "No Content/skin_pack folder",
        contentTypes: ["skin"],
    };

    protected expectedFolder(): string {
        return MarketplaceFolders.contentPath(MarketplaceLimits.SKIN_PACK_FOLDER);
    }
}
