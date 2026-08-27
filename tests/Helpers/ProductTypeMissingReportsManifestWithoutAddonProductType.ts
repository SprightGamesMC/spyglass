import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { ProductTypeMissingReportsManifestWithoutAddonProductTypeCase } from "../Types/ProductTypeMissingReportsManifestWithoutAddonProductTypeTypes.js";
import ProductTypeMissing from "../../src/Checks/Marketplace/ProductTypeMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ProductTypeMissingReportsManifestWithoutAddonProductType {
    static readonly ID = "MARKETPLACE/107";
    static readonly CASES: readonly ProductTypeMissingReportsManifestWithoutAddonProductTypeCase[] = [
        {
            name: "metadata.product_type addon is the required product type",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior manifest without metadata has no product_type",
            files: ProductTypeMissingReportsManifestWithoutAddonProductType.withBehaviorManifest(ModelFixture.behaviorManifest()),
            expectedIds: ["MARKETPLACE/107"],
            expectedPaths: [MarketplaceFixture.BEHAVIOR_MANIFEST],
        },
        {
            name: "metadata.product_type world is not addon",
            files: ProductTypeMissingReportsManifestWithoutAddonProductType.withBehaviorManifest(
                MarketplaceFixture.behaviorManifest({ metadata: { product_type: "world" } })
            ),
            expectedIds: ["MARKETPLACE/107"],
            expectedPaths: [MarketplaceFixture.BEHAVIOR_MANIFEST],
        },
    ];

    static async run(entry: ProductTypeMissingReportsManifestWithoutAddonProductTypeCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ProductTypeMissing(), entry);
    }

    private static withBehaviorManifest(manifest: Record<string, unknown>): FixtureFiles {
        return {
            ...MarketplaceFixture.addonSubmission(),
            [MarketplaceFixture.BEHAVIOR_MANIFEST]: manifest,
        };
    }
}
