import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LockTemplateOptionsNotApplicableReportsNonWorldTemplateCase } from "../Types/LockTemplateOptionsNotApplicableReportsNonWorldTemplateTypes.js";
import LockTemplateOptionsNotApplicable from "../../src/Checks/Manifest/LockTemplateOptionsNotApplicable.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class LockTemplateOptionsNotApplicableReportsNonWorldTemplate {
    static readonly ID = "MANIFEST/208";
    static readonly CASES: readonly LockTemplateOptionsNotApplicableReportsNonWorldTemplateCase[] = [
        {
            name: "lock_template_options on a world template is applicable",
            files: { "WT/manifest.json": ModelFixture.worldTemplateManifest() },
            expectedIds: [],
        },
        {
            name: "lock_template_options on a resource pack only applies to world templates",
            files: { "RP/manifest.json": ManifestFixture.withHeader(ModelFixture.resourceManifest(), { lock_template_options: false }) },
            expectedIds: ["MANIFEST/208"],
        },
    ];

    static async run(entry: LockTemplateOptionsNotApplicableReportsNonWorldTemplateCase): Promise<FindingSummary> {
        return ManifestFixture.run(new LockTemplateOptionsNotApplicable(), entry);
    }
}
