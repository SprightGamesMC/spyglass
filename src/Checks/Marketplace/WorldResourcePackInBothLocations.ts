import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";

export default class WorldResourcePackInBothLocations extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.WORLD_RESOURCE_PACK_IN_BOTH_LOCATIONS,
        slug: "world-resource-pack-in-both-locations",
        severity: "error",
        description: "World has a resource pack under both Content/resource_packs and Content/world_template/resource_packs",
        contentTypes: ["world"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const resourcePacks = context.model.packs.filter((pack) => pack.type === PackItemLoader.RESOURCE_PACK_TYPE);
        const nested = resourcePacks.filter((pack) => MarketplaceFolders.isNestedInWorld(context.model, pack));
        const standalone = resourcePacks.filter((pack) => !MarketplaceFolders.isNestedInWorld(context.model, pack));

        if (nested.length === 0 || standalone.length === 0) {
            return [];
        }

        const standaloneRoots = standalone.map((pack) => pack.root).join(", ");

        return nested.map((pack) =>
            this.finding(
                "Resource pack " +
                    pack.root +
                    " is inside the world template while " +
                    standaloneRoots +
                    " is outside it, expected one place",
                pack.root,
                pack.root
            )
        );
    }
}
