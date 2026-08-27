import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BehaviorPackNotAllowedReportsBehaviorManifestCase } from "../Types/BehaviorPackNotAllowedReportsBehaviorManifestTypes.js";
import BehaviorPackNotAllowed from "../../src/Checks/TexturePack/BehaviorPackNotAllowed.js";
import ModelFixture from "./Core/ModelFixture.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class BehaviorPackNotAllowedReportsBehaviorManifest {
    static readonly ID = "TEXTUREPACK/701";
    static readonly CASES: readonly BehaviorPackNotAllowedReportsBehaviorManifestCase[] = [
        {
            name: "resource pack alone is what a texture pack must be",
            files: TextureFixture.resourcePack({}),
            options: { contentType: "texture" },
            expectedIds: [],
        },
        {
            name: "behavior pack next to the resource pack is not allowed in a texture pack",
            files: { ...TextureFixture.resourcePack({}), "BP/manifest.json": ModelFixture.behaviorManifest() },
            options: { contentType: "texture" },
            expectedIds: [BehaviorPackNotAllowedReportsBehaviorManifest.ID],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static run(entry: BehaviorPackNotAllowedReportsBehaviorManifestCase): Promise<FindingSummary> {
        return TextureFixture.summary(new BehaviorPackNotAllowed(), entry);
    }
}
