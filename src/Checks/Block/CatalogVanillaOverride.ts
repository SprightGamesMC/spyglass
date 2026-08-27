import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import BlockCatalogLoader from "../../Loaders/BlockCatalogLoader.js";
import Check from "../Check.js";
import BlockChecks from "./BlockChecks.js";

export default class CatalogVanillaOverride extends Check {
    readonly definition: CheckDefinition = {
        group: BlockChecks.GROUP,
        number: BlockChecks.CATALOG_VANILLA_OVERRIDE,
        slug: "catalog-vanilla-override",
        severity: "recommendation",
        description: "blocks.json entry overrides a vanilla block",
        excludedContentTypes: ["texture", "addon"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const usage = await BlockCatalogLoader.load(context);

        return usage.vanillaOverrides.map((entry) =>
            this.finding("blocks.json entry " + entry.key + " overrides a vanilla block", entry.path, entry.pack, { field: entry.key })
        );
    }
}
