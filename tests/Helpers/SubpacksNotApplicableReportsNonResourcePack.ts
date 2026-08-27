import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SubpacksNotApplicableReportsNonResourcePackCase } from "../Types/SubpacksNotApplicableReportsNonResourcePackTypes.js";
import SubpacksNotApplicable from "../../src/Checks/Manifest/SubpacksNotApplicable.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SubpacksNotApplicableReportsNonResourcePack {
    static readonly ID = "MANIFEST/214";
    static readonly CASES: readonly SubpacksNotApplicableReportsNonResourcePackCase[] = [
        {
            name: "subpacks on a resource pack is applicable",
            files: ManifestFixture.resourceWithSubpacks(ManifestFixture.VALID_SUBPACKS),
            expectedIds: [],
        },
        {
            name: "subpacks on a behavior pack only applies to resource packs",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ subpacks: ManifestFixture.VALID_SUBPACKS }) },
            expectedIds: ["MANIFEST/214"],
        },
    ];

    static async run(entry: SubpacksNotApplicableReportsNonResourcePackCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SubpacksNotApplicable(), entry);
    }
}
