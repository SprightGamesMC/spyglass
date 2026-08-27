import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackIconMissingReportsPackWithoutIconCase } from "../Types/PackIconMissingReportsPackWithoutIconTypes.js";
import PackIconMissing from "../../src/Checks/Manifest/PackIconMissing.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PackIconMissingReportsPackWithoutIcon {
    static readonly ID = "MANIFEST/105";
    static readonly CASES: readonly PackIconMissingReportsPackWithoutIconCase[] = [
        {
            name: "behavior pack with pack_icon.png has the required icon",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 64, height: 64 })),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior pack without pack_icon.png lacks the required icon",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: ["MANIFEST/105"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "skin pack is exempt from the pack icon requirement",
            files: { "SP/manifest.json": ModelFixture.skinManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona pack is exempt from the pack icon requirement",
            files: { "PP/manifest.json": ModelFixture.personaManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world template pack is exempt because it uses world_icon.jpeg",
            files: { "manifest.json": ModelFixture.worldTemplateManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static async run(entry: PackIconMissingReportsPackWithoutIconCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PackIconMissing(), entry);
    }
}
