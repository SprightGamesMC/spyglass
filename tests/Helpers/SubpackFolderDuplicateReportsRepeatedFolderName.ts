import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SubpackFolderDuplicateReportsRepeatedFolderNameCase } from "../Types/SubpackFolderDuplicateReportsRepeatedFolderNameTypes.js";
import SubpackFolderDuplicate from "../../src/Checks/Manifest/SubpackFolderDuplicate.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SubpackFolderDuplicateReportsRepeatedFolderName {
    static readonly ID = "MANIFEST/603";
    static readonly CASES: readonly SubpackFolderDuplicateReportsRepeatedFolderNameCase[] = [
        {
            name: "low and high folder_name values are distinct",
            files: ManifestFixture.resourceWithSubpacks(ManifestFixture.VALID_SUBPACKS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "two subpacks with folder_name low share a folder name",
            files: ManifestFixture.resourceWithSubpacks([
                { folder_name: "low", name: "Low", memory_tier: 1 },
                { folder_name: "low", name: "High", memory_tier: 4 },
            ]),
            expectedIds: ["MANIFEST/603"],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static async run(entry: SubpackFolderDuplicateReportsRepeatedFolderNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SubpackFolderDuplicate(), entry);
    }
}
