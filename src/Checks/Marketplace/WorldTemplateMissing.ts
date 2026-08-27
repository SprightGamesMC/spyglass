import type { CheckDefinition } from "../../Types/CheckTypes.js";
import MarketplaceFolderMissingCheck from "./MarketplaceFolderMissingCheck.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class WorldTemplateMissing extends MarketplaceFolderMissingCheck {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.WORLD_TEMPLATE_MISSING,
        slug: "world-template-missing",
        severity: "error",
        description: "No Content/world_template folder",
        contentTypes: ["world"],
    };

    protected expectedFolder(): string {
        return MarketplaceFolders.contentPath(MarketplaceLimits.WORLD_TEMPLATE_FOLDER);
    }
}
