import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ModuleNameNotAllowedReportsUnknownModuleNameCase } from "../Types/ModuleNameNotAllowedReportsUnknownModuleNameTypes.js";
import ModuleNameNotAllowed from "../../src/Checks/Manifest/ModuleNameNotAllowed.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class ModuleNameNotAllowedReportsUnknownModuleName {
    static readonly ID = "MANIFEST/211";
    static readonly CASES: readonly ModuleNameNotAllowedReportsUnknownModuleNameCase[] = [
        {
            name: "@minecraft/server is an allowed module_name",
            files: ManifestFixture.behaviorWithDependencies(ManifestFixture.VALID_DEPENDENCIES),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "@minecraft/unknown is not an allowed module_name",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/unknown", version: "1.2.0" }]),
            expectedIds: ["MANIFEST/211"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "constructor is an object prototype key not an allowed module_name",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "constructor", version: "1.2.0" }]),
            expectedIds: ["MANIFEST/211"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: ModuleNameNotAllowedReportsUnknownModuleNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new ModuleNameNotAllowed(), entry);
    }
}
