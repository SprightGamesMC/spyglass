import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbrCase } from "../Types/PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbrTypes.js";
import PbrCapabilityMissing from "../../src/Checks/Manifest/PbrCapabilityMissing.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr {
    static readonly ID = "MANIFEST/103";
    static readonly CASES: readonly PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbrCase[] = [
        {
            name: "metalness_emissive_roughness layer with pbr capability declared satisfies the capability rule",
            files: ManifestFixture.resourceWithTextureSet({ capabilities: ["pbr"] }, ["color", "metalness_emissive_roughness"]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "color only texture set needs no pbr capability",
            files: ManifestFixture.resourceWithTextureSet({}, ["color"]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "metalness_emissive_roughness layer without pbr capability lacks the required capability",
            files: ManifestFixture.resourceWithTextureSet({}, ["color", "metalness_emissive_roughness"]),
            expectedIds: ["MANIFEST/103"],
            expectedPaths: ["RP/manifest.json"],
        },
        {
            name: "normal layer without pbr capability lacks the required capability",
            files: ManifestFixture.resourceWithTextureSet({}, ["color", "normal"]),
            expectedIds: ["MANIFEST/103"],
            expectedPaths: ["RP/manifest.json"],
        },
        {
            name: "heightmap layer without pbr capability lacks the required capability",
            files: ManifestFixture.resourceWithTextureSet({}, ["color", "heightmap"]),
            expectedIds: ["MANIFEST/103"],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static async run(entry: PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbrCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PbrCapabilityMissing(), entry);
    }
}
