import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { MultipleManifestsReportsNestedManifestInPackCase } from "../Types/MultipleManifestsReportsNestedManifestInPackTypes.js";
import MultipleManifests from "../../src/Checks/Pack/MultipleManifests.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleManifestsReportsNestedManifestInPack {
    static readonly ID = "PACK/601";
    static readonly CASES: readonly MultipleManifestsReportsNestedManifestInPackCase[] = [
        {
            name: "BP and RP with one manifest.json each have no extra manifest",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest(), "RP/manifest.json": ModelFixture.resourceManifest() },
            expectedPacks: [],
        },
        {
            name: "BP/old/manifest.json is a second manifest inside the BP pack",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest(), "BP/old/manifest.json": ModelFixture.behaviorManifest() },
            expectedPacks: ["BP"],
        },
        {
            name: "manifests under behavior_packs and resource_packs are part of nested packs not the world template",
            files: {
                "WT/manifest.json": ModelFixture.worldTemplateManifest(),
                "WT/level.dat": new Uint8Array([0]),
                "WT/behavior_packs/bp/manifest.json": ModelFixture.behaviorManifest(),
                "WT/resource_packs/rp/manifest.json": ModelFixture.resourceManifest(),
            },
            expectedPacks: [],
        },
        {
            name: "WT/db/manifest.json is a second manifest inside the world template",
            files: {
                "WT/manifest.json": ModelFixture.worldTemplateManifest(),
                "WT/level.dat": new Uint8Array([0]),
                "WT/db/manifest.json": ModelFixture.behaviorManifest(),
            },
            expectedPacks: ["WT"],
        },
    ];

    static run(files: FixtureFiles): Promise<Finding[]> {
        return ModelFixture.findings(new MultipleManifests(), files);
    }
}
