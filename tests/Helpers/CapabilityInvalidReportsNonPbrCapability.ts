import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { CapabilityInvalidReportsNonPbrCapabilityCase } from "../Types/CapabilityInvalidReportsNonPbrCapabilityTypes.js";
import CapabilityInvalid from "../../src/Checks/Manifest/CapabilityInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class CapabilityInvalidReportsNonPbrCapability {
    static readonly ID = "MANIFEST/213";
    static readonly CASES: readonly CapabilityInvalidReportsNonPbrCapabilityCase[] = [
        {
            name: "pbr is the one capability a resource pack may declare",
            files: { "RP/manifest.json": ModelFixture.resourceManifest({ capabilities: ["pbr"] }) },
            expectedIds: [],
        },
        {
            name: "raytraced is not an allowed resource pack capability",
            files: { "RP/manifest.json": ModelFixture.resourceManifest({ capabilities: ["raytraced"] }) },
            expectedIds: ["MANIFEST/213"],
        },
        {
            name: "raytraced on a behavior pack is reported by the behavior pack capabilities check",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ capabilities: ["raytraced"] }) },
            expectedIds: [],
        },
    ];

    static async run(entry: CapabilityInvalidReportsNonPbrCapabilityCase): Promise<FindingSummary> {
        return ManifestFixture.run(new CapabilityInvalid(), entry);
    }
}
