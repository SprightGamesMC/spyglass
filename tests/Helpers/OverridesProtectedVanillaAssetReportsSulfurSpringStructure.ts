import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackType } from "../../src/Types/ModelTypes.js";
import type { OverridesProtectedVanillaAssetReportsSulfurSpringStructureCase } from "../Types/OverridesProtectedVanillaAssetReportsSulfurSpringStructureTypes.js";
import OverridesProtectedVanillaAsset from "../../src/Checks/Pack/OverridesProtectedVanillaAsset.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class OverridesProtectedVanillaAssetReportsSulfurSpringStructure {
    static readonly ID = "PACK/602";
    static readonly ROOT = "pack";
    static readonly CASES: readonly OverridesProtectedVanillaAssetReportsSulfurSpringStructureCase[] = [
        {
            name: "structures/mine/hut.mcstructure is not a protected vanilla path",
            packType: "behavior",
            packPath: "structures/mine/hut.mcstructure",
            expectFinding: false,
        },
        {
            name: "structures/sulfur_spring in a behavior pack is a protected vanilla path",
            packType: "behavior",
            packPath: "structures/sulfur_spring/a.mcstructure",
            expectFinding: true,
        },
        {
            name: "Structures/Sulfur_Spring matches the protected vanilla path ignoring case",
            packType: "behavior",
            packPath: "Structures/Sulfur_Spring/a.mcstructure",
            expectFinding: true,
        },
        {
            name: "structures/sulfur_springs is a different folder from the protected sulfur_spring path",
            packType: "behavior",
            packPath: "structures/sulfur_springs/a.mcstructure",
            expectFinding: false,
        },
        {
            name: "structures/sulfur_spring in a resource pack is outside the behavior pack the protection applies to",
            packType: "resource",
            packPath: "structures/sulfur_spring/a.mcstructure",
            expectFinding: false,
        },
    ];

    static run(packType: PackType, packPath: string): Promise<Finding[]> {
        const root = OverridesProtectedVanillaAssetReportsSulfurSpringStructure.ROOT;
        const manifest = packType === "resource" ? ModelFixture.resourceManifest() : ModelFixture.behaviorManifest();
        const files = { [root + "/manifest.json"]: manifest, [root + "/" + packPath]: new Uint8Array([0]) };
        return ModelFixture.findings(new OverridesProtectedVanillaAsset(), files);
    }
}
