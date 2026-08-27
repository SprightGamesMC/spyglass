import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class ProductTypeMissing extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PRODUCT_TYPE_MISSING,
        slug: "product-type-missing",
        severity: "error",
        description: "metadata.product_type is missing or not addon",
        contentTypes: ["addon"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            const manifest = await ManifestLoader.read(context.loaders, pack);

            if (manifest === undefined) {
                continue;
            }

            const productType = JsonLoader.get(manifest, "metadata", "product_type");

            if (productType === MarketplaceLimits.ADDON_PRODUCT_TYPE) {
                continue;
            }

            const actual = typeof productType === "string" ? productType : "missing";

            findings.push(
                this.finding(
                    "metadata.product_type is " + actual + ", expected " + MarketplaceLimits.ADDON_PRODUCT_TYPE,
                    pack.manifestPath,
                    pack.root,
                    { field: "metadata.product_type" }
                )
            );
        }

        return findings;
    }
}
