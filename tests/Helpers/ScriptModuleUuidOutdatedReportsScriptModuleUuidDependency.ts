import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ScriptModuleUuidOutdatedReportsScriptModuleUuidDependencyCase } from "../Types/ScriptModuleUuidOutdatedReportsScriptModuleUuidDependencyTypes.js";
import ScriptModuleUuidOutdated from "../../src/Checks/Manifest/ScriptModuleUuidOutdated.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency {
    static readonly ID = "MANIFEST/506";
    static readonly SERVER_UUID = "b26a4d4c-afdf-4690-88f8-931846312678";
    static readonly CASES: readonly ScriptModuleUuidOutdatedReportsScriptModuleUuidDependencyCase[] = [
        {
            name: "@minecraft/server declared by module_name is the current form",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server", version: "1.2.0" }]),
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "pack uuid is not a script module uuid",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: ManifestFixture.PACK_UUID, version: [1, 0, 0] }]),
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "@minecraft/server declared by uuid is the outdated form",
            files: ManifestFixture.behaviorWithDependencies([
                { uuid: ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.SERVER_UUID, version: "1.2.0" },
            ]),
            expectedIds: ["MANIFEST/506"],
            expectedFields: ["dependencies[0].uuid"],
        },
        {
            name: "upper case script module uuid matches ignoring case",
            files: ManifestFixture.behaviorWithDependencies([
                { uuid: ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.SERVER_UUID.toUpperCase(), version: "1.2.0" },
            ]),
            expectedIds: ["MANIFEST/506"],
            expectedFields: ["dependencies[0].uuid"],
        },
    ];

    static async run(entry: ScriptModuleUuidOutdatedReportsScriptModuleUuidDependencyCase): Promise<FindingSummary> {
        return ManifestFixture.run(new ScriptModuleUuidOutdated(), entry);
    }
}
