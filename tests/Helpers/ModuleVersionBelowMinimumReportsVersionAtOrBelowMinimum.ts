import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimumCase } from "../Types/ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimumTypes.js";
import ModuleVersionBelowMinimum from "../../src/Checks/Manifest/ModuleVersionBelowMinimum.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum {
    static readonly ID = "MANIFEST/504";
    static readonly CASES: readonly ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimumCase[] = [
        {
            name: "@minecraft/server version 1.2.0 is above 1.0.0",
            files: ManifestFixture.behaviorWithDependencies(ManifestFixture.VALID_DEPENDENCIES),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "@minecraft/server version 1.0.0 is not above 1.0.0",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server", version: "1.0.0" }]),
            expectedIds: ["MANIFEST/504"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "@minecraft/server-ui version 0.9.0 is below 1.0.0",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server-ui", version: [0, 9, 0] }]),
            expectedIds: ["MANIFEST/504"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "uuid dependency version 0.0.1 is a pack dependency not a module",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: ManifestFixture.PACK_UUID, version: [0, 0, 1] }]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "constructor version 0.0.1 is an object prototype key with no minimum version",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "constructor", version: [0, 0, 1] }]),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static async run(entry: ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimumCase): Promise<FindingSummary> {
        return ManifestFixture.run(new ModuleVersionBelowMinimum(), entry);
    }
}
