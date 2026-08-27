import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SubpackNameDuplicateReportsRepeatedSubpackNameCase } from "../Types/SubpackNameDuplicateReportsRepeatedSubpackNameTypes.js";
import SubpackNameDuplicate from "../../src/Checks/Manifest/SubpackNameDuplicate.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SubpackNameDuplicateReportsRepeatedSubpackName {
    static readonly ID = "MANIFEST/604";
    static readonly CASES: readonly SubpackNameDuplicateReportsRepeatedSubpackNameCase[] = [
        {
            name: "Low and High subpack names are distinct",
            files: ManifestFixture.resourceWithSubpacks(ManifestFixture.VALID_SUBPACKS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "two subpacks named Same share a name",
            files: ManifestFixture.resourceWithSubpacks([
                { folder_name: "low", name: "Same", memory_tier: 1 },
                { folder_name: "high", name: "Same", memory_tier: 4 },
            ]),
            expectedIds: ["MANIFEST/604"],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static async run(entry: SubpackNameDuplicateReportsRepeatedSubpackNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SubpackNameDuplicate(), entry);
    }
}
