import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { PackNotReferencedReportsUnlistedPackCase } from "../Types/PackNotReferencedReportsUnlistedPackTypes.js";
import PackNotReferenced from "../../src/Checks/Marketplace/PackNotReferenced.js";
import ModelFixture from "./Core/ModelFixture.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PackNotReferencedReportsUnlistedPack {
    static readonly ID = "MARKETPLACE/301";
    static readonly CASES: readonly PackNotReferencedReportsUnlistedPackCase[] = [
        {
            name: "each pack uuid listed in its reference file is referenced",
            files: MarketplaceFixture.worldSubmission(),
            contentType: "world",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "resource pack uuid absent from world_resource_packs.json is not referenced",
            files: PackNotReferencedReportsUnlistedPack.withResourceReference(ModelFixture.OTHER_UUID),
            contentType: "world",
            expectedIds: ["MARKETPLACE/301"],
            expectedPaths: [MarketplaceFixture.WORLD_RESOURCE_REFERENCES],
        },
    ];

    static async run(entry: PackNotReferencedReportsUnlistedPackCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PackNotReferenced(), entry);
    }

    private static withResourceReference(packId: string): FixtureFiles {
        return {
            ...MarketplaceFixture.worldSubmission(),
            [MarketplaceFixture.WORLD_RESOURCE_REFERENCES]: MarketplaceFixture.resourceReferences([
                { pack_id: packId, version: [1, 0, 0] },
            ]),
        };
    }
}
