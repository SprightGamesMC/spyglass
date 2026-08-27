import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ManifestMissingReportsPackFolderWithoutManifestCase } from "../Types/ManifestMissingReportsPackFolderWithoutManifestTypes.js";
import ManifestMissing from "../../src/Checks/Pack/ManifestMissing.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ManifestMissingReportsPackFolderWithoutManifest {
    static readonly ID = "PACK/101";
    static readonly CASES: readonly ManifestMissingReportsPackFolderWithoutManifestCase[] = [
        {
            name: "behavior_packs/bp has a manifest.json",
            files: { "behavior_packs/bp/manifest.json": ModelFixture.behaviorManifest(), "behavior_packs/bp/entities/a.json": "{}" },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior_packs/bp inside a pack container has no manifest.json",
            files: { "behavior_packs/bp/entities/a.json": "{}", "resource_packs/rp/manifest.json": ModelFixture.resourceManifest() },
            expectedIds: ["PACK/101"],
            expectedPaths: ["behavior_packs/bp"],
        },
        {
            name: "Content/skin_pack with skins.json has no manifest.json",
            files: { "Content/skin_pack/skins.json": "{}", "Content/skin_pack/texts/en_US.lang": "" },
            expectedIds: ["PACK/101"],
            expectedPaths: ["Content/skin_pack"],
        },
        {
            name: "input with only readme.txt has no manifest.json at any level",
            files: { "readme.txt": "hello" },
            expectedIds: ["PACK/101"],
            expectedPaths: [""],
        },
    ];

    static run(entry: ManifestMissingReportsPackFolderWithoutManifestCase): Promise<FindingSummary> {
        return ModelFixture.summary(new ManifestMissing(), entry.files);
    }
}
