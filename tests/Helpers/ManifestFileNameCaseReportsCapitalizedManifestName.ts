import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ManifestFileNameCaseReportsCapitalizedManifestNameCase } from "../Types/ManifestFileNameCaseReportsCapitalizedManifestNameTypes.js";
import ManifestFileNameCase from "../../src/Checks/Marketplace/ManifestFileNameCase.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ManifestFileNameCaseReportsCapitalizedManifestName {
    static readonly ID = "MARKETPLACE/203";
    static readonly CAPITALIZED_MANIFEST = MarketplaceFixture.RESOURCE_ROOT + "/Manifest.json";
    static readonly CASES: readonly ManifestFileNameCaseReportsCapitalizedManifestNameCase[] = [
        {
            name: "manifest.json in lower case is the exact required file name",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Manifest.json with a capital M is not exactly manifest.json",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.RESOURCE_ROOT + "/manifest.json",
                ManifestFileNameCaseReportsCapitalizedManifestName.CAPITALIZED_MANIFEST
            ),
            expectedIds: ["MARKETPLACE/203"],
            expectedPaths: [ManifestFileNameCaseReportsCapitalizedManifestName.CAPITALIZED_MANIFEST],
        },
    ];

    static async run(entry: ManifestFileNameCaseReportsCapitalizedManifestNameCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ManifestFileNameCase(), entry);
    }
}
