import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BaseGameVersionNotApplicableReportsNonWorldTemplateCase } from "../Types/BaseGameVersionNotApplicableReportsNonWorldTemplateTypes.js";
import BaseGameVersionNotApplicable from "../../src/Checks/Manifest/BaseGameVersionNotApplicable.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class BaseGameVersionNotApplicableReportsNonWorldTemplate {
    static readonly ID = "MANIFEST/207";
    static readonly CASES: readonly BaseGameVersionNotApplicableReportsNonWorldTemplateCase[] = [
        {
            name: "base_game_version on a world template is applicable",
            files: { "WT/manifest.json": ModelFixture.worldTemplateManifest() },
            expectedIds: [],
        },
        {
            name: "base_game_version on a behavior pack only applies to world templates",
            files: { "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest(), { base_game_version: [1, 21, 0] }) },
            expectedIds: ["MANIFEST/207"],
        },
    ];

    static async run(entry: BaseGameVersionNotApplicableReportsNonWorldTemplateCase): Promise<FindingSummary> {
        return ManifestFixture.run(new BaseGameVersionNotApplicable(), entry);
    }
}
