import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ModuleTypeInvalidReportsUnknownModuleTypeCase } from "../Types/ModuleTypeInvalidReportsUnknownModuleTypeTypes.js";
import ModuleTypeInvalid from "../../src/Checks/Manifest/ModuleTypeInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class ModuleTypeInvalidReportsUnknownModuleType {
    static readonly ID = "MANIFEST/209";
    static readonly CASES: readonly ModuleTypeInvalidReportsUnknownModuleTypeCase[] = [
        {
            name: "data module is a known module type",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "DATA module in upper case is a known module type ignoring case",
            files: ManifestFixture.behaviorWithModules([
                { type: "DATA", uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: [1, 0, 0] },
            ]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "javascript module is not a known module type",
            files: ManifestFixture.behaviorWithModules([
                { type: "javascript", uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: [1, 0, 0] },
            ]),
            expectedIds: ["MANIFEST/209"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "module without a type field has no known module type",
            files: ManifestFixture.behaviorWithModules([{ uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: [1, 0, 0] }]),
            expectedIds: ["MANIFEST/209"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: ModuleTypeInvalidReportsUnknownModuleTypeCase): Promise<FindingSummary> {
        return ManifestFixture.run(new ModuleTypeInvalid(), entry);
    }
}
