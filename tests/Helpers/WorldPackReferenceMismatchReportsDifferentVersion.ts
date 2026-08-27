import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { WorldPackReferenceMismatchReportsDifferentVersionCase } from "../Types/WorldPackReferenceMismatchReportsDifferentVersionTypes.js";
import WorldPackReferenceMismatch from "../../src/Checks/Marketplace/WorldPackReferenceMismatch.js";
import ModelFixture from "./Core/ModelFixture.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class WorldPackReferenceMismatchReportsDifferentVersion {
    static readonly ID = "MARKETPLACE/208";
    static readonly CASES: readonly WorldPackReferenceMismatchReportsDifferentVersionCase[] = [
        {
            name: "reference version equal to the pack manifest version matches",
            files: MarketplaceFixture.worldSubmission(),
            contentType: "world",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "resource reference version 2.0.0 differs from the pack manifest version",
            files: WorldPackReferenceMismatchReportsDifferentVersion.withResourceReference(ModelFixture.RESOURCE_UUID, [2, 0, 0]),
            contentType: "world",
            expectedIds: ["MARKETPLACE/208"],
            expectedPaths: [MarketplaceFixture.WORLD_RESOURCE_REFERENCES],
        },
    ];

    static async run(entry: WorldPackReferenceMismatchReportsDifferentVersionCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new WorldPackReferenceMismatch(), entry);
    }

    private static withResourceReference(packId: string, version: readonly number[]): FixtureFiles {
        return {
            ...MarketplaceFixture.worldSubmission(),
            [MarketplaceFixture.WORLD_RESOURCE_REFERENCES]: MarketplaceFixture.resourceReferences([{ pack_id: packId, version }]),
        };
    }
}
