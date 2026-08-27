import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import BlockCatalogLoader from "../../Loaders/BlockCatalogLoader.js";
import Check from "../Check.js";
import BlockChecks from "./BlockChecks.js";

export default class CatalogResourceUnused extends Check {
    readonly definition: CheckDefinition = {
        group: BlockChecks.GROUP,
        number: BlockChecks.CATALOG_RESOURCE_UNUSED,
        slug: "catalog-resource-unused",
        severity: "warning",
        description: "blocks.json entry not used by any block",
        excludedContentTypes: ["texture"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const usage = await BlockCatalogLoader.load(context);

        return usage.unused.map((entry) =>
            this.finding("blocks.json entry " + entry.key + " has no block definition in any behavior pack", entry.path, entry.pack, {
                field: entry.key,
            })
        );
    }
}
