import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import BlockCatalogLoader from "../../Loaders/BlockCatalogLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";

export default class CatalogVanillaOverride extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.CATALOG_VANILLA_OVERRIDE,
        slug: "catalog-vanilla-override",
        severity: "error",
        description: "blocks.json entry overrides a vanilla block",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const usage = await BlockCatalogLoader.load(context);

        return usage.vanillaOverrides.map((entry) =>
            this.finding("blocks.json entry " + entry.key + " overrides the vanilla block " + entry.key, entry.path, entry.pack, {
                field: entry.key,
            })
        );
    }
}
