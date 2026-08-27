import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultipleWorldTemplateModulesReportsSecondWorldTemplateModuleCase } from "../Types/MultipleWorldTemplateModulesReportsSecondWorldTemplateModuleTypes.js";
import MultipleWorldTemplateModules from "../../src/Checks/Manifest/MultipleWorldTemplateModules.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class MultipleWorldTemplateModulesReportsSecondWorldTemplateModule {
    static readonly ID = "MANIFEST/602";
    static readonly CASES: readonly MultipleWorldTemplateModulesReportsSecondWorldTemplateModuleCase[] = [
        {
            name: "one world_template module is the allowed count",
            files: { "WT/manifest.json": ModelFixture.worldTemplateManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "two world_template modules are more than the one allowed",
            files: {
                "WT/manifest.json": ModelFixture.worldTemplateManifest({
                    modules: [
                        { type: "world_template", uuid: "d091cd9f-8e9c-4dab-8f5a-7b8c9daebfc0", version: [1, 0, 0] },
                        { type: "world_template", uuid: "3c4d5e6f-7a8b-4c9d-8e0f-1a2b3c4d5e6f", version: [1, 0, 0] },
                    ],
                }),
            },
            expectedIds: ["MANIFEST/602"],
            expectedPaths: ["WT/manifest.json"],
        },
        {
            name: "world_template and World_Template modules are two ignoring case",
            files: {
                "WT/manifest.json": ModelFixture.worldTemplateManifest({
                    modules: [
                        { type: "world_template", uuid: "d091cd9f-8e9c-4dab-8f5a-7b8c9daebfc0", version: [1, 0, 0] },
                        { type: "World_Template", uuid: "3c4d5e6f-7a8b-4c9d-8e0f-1a2b3c4d5e6f", version: [1, 0, 0] },
                    ],
                }),
            },
            expectedIds: ["MANIFEST/602"],
            expectedPaths: ["WT/manifest.json"],
        },
    ];

    static async run(entry: MultipleWorldTemplateModulesReportsSecondWorldTemplateModuleCase): Promise<FindingSummary> {
        return ManifestFixture.run(new MultipleWorldTemplateModules(), entry);
    }
}
