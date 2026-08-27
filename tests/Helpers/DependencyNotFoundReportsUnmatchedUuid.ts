import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { DependencyNotFoundReportsUnmatchedUuidCase } from "../Types/DependencyNotFoundReportsUnmatchedUuidTypes.js";
import DependencyNotFound from "../../src/Checks/Manifest/DependencyNotFound.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class DependencyNotFoundReportsUnmatchedUuid {
    static readonly ID = "MANIFEST/301";
    static readonly CASES: readonly DependencyNotFoundReportsUnmatchedUuidCase[] = [
        {
            name: "dependency uuid matches the resource pack in the project",
            files: {
                ...ManifestFixture.behaviorWithDependencies([{ uuid: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] }]),
                "RP/manifest.json": ModelFixture.resourceManifest(),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "upper case dependency uuid matches the resource pack uuid ignoring case",
            files: {
                ...ManifestFixture.behaviorWithDependencies([{ uuid: ModelFixture.RESOURCE_UUID.toUpperCase(), version: [1, 0, 0] }]),
                "RP/manifest.json": ModelFixture.resourceManifest(),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dependency uuid matches the world template in the project",
            files: {
                ...ManifestFixture.behaviorWithDependencies([{ uuid: ManifestFixture.WORLD_TEMPLATE_UUID, version: [1, 0, 0] }]),
                "WT/manifest.json": ModelFixture.worldTemplateManifest(),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior pack dependency uuid matches no pack in the project",
            files: {
                ...ManifestFixture.behaviorWithDependencies([{ uuid: ManifestFixture.UNKNOWN_UUID, version: [1, 0, 0] }]),
                "RP/manifest.json": ModelFixture.resourceManifest(),
            },
            expectedIds: ["MANIFEST/301"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "resource pack dependency uuid matches no pack in the project",
            files: {
                "RP/manifest.json": ModelFixture.resourceManifest({
                    dependencies: [{ uuid: ManifestFixture.UNKNOWN_UUID, version: [1, 0, 0] }],
                }),
            },
            expectedIds: ["MANIFEST/301"],
            expectedPaths: ["RP/manifest.json"],
        },
        {
            name: "world template dependency uuid is not checked because only behavior and resource packs are",
            files: {
                "WT/manifest.json": ModelFixture.worldTemplateManifest({
                    dependencies: [{ uuid: ManifestFixture.UNKNOWN_UUID, version: [1, 0, 0] }],
                }),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "module_name dependency @minecraft/server has no uuid to match",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server", version: "1.2.0" }]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dependency uuid of script module @minecraft/server names a module not a pack",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: "b26a4d4c-afdf-4690-88f8-931846312678", version: "1.2.0" }]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dependency uuid bad is not a valid uuid so it is not matched",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: "bad", version: [1, 0, 0] }]),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static async run(entry: DependencyNotFoundReportsUnmatchedUuidCase): Promise<FindingSummary> {
        return ManifestFixture.run(new DependencyNotFound(), entry);
    }
}
