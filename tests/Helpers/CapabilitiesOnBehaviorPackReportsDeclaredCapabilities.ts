import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { CapabilitiesOnBehaviorPackReportsDeclaredCapabilitiesCase } from "../Types/CapabilitiesOnBehaviorPackReportsDeclaredCapabilitiesTypes.js";
import CapabilitiesOnBehaviorPack from "../../src/Checks/Manifest/CapabilitiesOnBehaviorPack.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class CapabilitiesOnBehaviorPackReportsDeclaredCapabilities {
    static readonly ID = "MANIFEST/701";
    static readonly CASES: readonly CapabilitiesOnBehaviorPackReportsDeclaredCapabilitiesCase[] = [
        {
            name: "behavior pack without capabilities declares none",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
        },
        {
            name: "experimental_custom_ui on a behavior pack is a capability behavior packs may not declare",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ capabilities: ["experimental_custom_ui"] }) },
            expectedIds: ["MANIFEST/701"],
        },
        {
            name: "pbr on a resource pack is not a behavior pack capability",
            files: { "RP/manifest.json": ModelFixture.resourceManifest({ capabilities: ["pbr"] }) },
            expectedIds: [],
        },
    ];

    static async run(entry: CapabilitiesOnBehaviorPackReportsDeclaredCapabilitiesCase): Promise<FindingSummary> {
        return ManifestFixture.run(new CapabilitiesOnBehaviorPack(), entry);
    }
}
