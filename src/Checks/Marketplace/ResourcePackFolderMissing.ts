import type { CheckDefinition } from "../../Types/CheckTypes.js";
import MarketplaceFolderMissingCheck from "./MarketplaceFolderMissingCheck.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class ResourcePackFolderMissing extends MarketplaceFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.RESOURCE_PACK_FOLDER_MISSING,
        slug: "resource-pack-folder-missing",
        severity: "error",
        description: "No Content/resource_packs folder",
        contentTypes: ["texture"],
    };

    protected expectedFolder(): string {
        return MarketplaceFolders.contentPath(MarketplaceLimits.RESOURCE_PACKS_FOLDER);
    }
}
