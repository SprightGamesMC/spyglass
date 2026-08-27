import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { BetaModuleCase } from "../Types/BetaModuleOutdatedReportsOlderBetaVersionTypes.js";
import BetaModuleOutdated from "../../src/Checks/Script/BetaModuleOutdated.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BetaModuleOutdatedReportsOlderBetaVersion {
    static readonly ID = "SCRIPT/501";
    static readonly SERVER_MODULE = "@minecraft/server";
    static readonly PACK_ROOT = "BP";
    static readonly NESTED_PACK_ROOT = "World/behavior_packs/BP";
    static readonly CASES: readonly BetaModuleCase[] = [
        {
            name: "@minecraft/server 2.1.0-beta starts with the current beta 2.1.0",
            packRoot: BetaModuleOutdatedReportsOlderBetaVersion.PACK_ROOT,
            moduleName: BetaModuleOutdatedReportsOlderBetaVersion.SERVER_MODULE,
            version: "2.1.0-beta",
            betaModuleVersions: { "@minecraft/server": "2.1.0" },
            expectFinding: false,
        },
        {
            name: "@minecraft/server 1.8.0 has no -beta so it is not a beta dependency",
            packRoot: BetaModuleOutdatedReportsOlderBetaVersion.PACK_ROOT,
            moduleName: BetaModuleOutdatedReportsOlderBetaVersion.SERVER_MODULE,
            version: "1.8.0",
            betaModuleVersions: { "@minecraft/server": "2.1.0" },
            expectFinding: false,
        },
        {
            name: "@minecraft/unknown 1.0.0-beta has no known current beta to compare against",
            packRoot: BetaModuleOutdatedReportsOlderBetaVersion.PACK_ROOT,
            moduleName: "@minecraft/unknown",
            version: "1.0.0-beta",
            betaModuleVersions: { "@minecraft/server": "2.1.0" },
            expectFinding: false,
        },
        {
            name: "@minecraft/server 2.0.0-beta is older than the current beta 2.1.0",
            packRoot: BetaModuleOutdatedReportsOlderBetaVersion.PACK_ROOT,
            moduleName: BetaModuleOutdatedReportsOlderBetaVersion.SERVER_MODULE,
            version: "2.0.0-beta",
            betaModuleVersions: { "@minecraft/server": "2.1.0" },
            expectFinding: true,
        },
        {
            name: "@minecraft/server 2.0.0-beta in a pack nested in a world is reported once",
            packRoot: BetaModuleOutdatedReportsOlderBetaVersion.NESTED_PACK_ROOT,
            moduleName: BetaModuleOutdatedReportsOlderBetaVersion.SERVER_MODULE,
            version: "2.0.0-beta",
            betaModuleVersions: { "@minecraft/server": "2.1.0" },
            expectFinding: true,
        },
    ];

    static async run(entry: BetaModuleCase): Promise<Finding[]> {
        const manifest = ModelFixture.behaviorManifest({
            dependencies: [{ module_name: entry.moduleName, version: entry.version }],
        });
        const files: Record<string, FixtureFiles[string]> = { [entry.packRoot + "/manifest.json"]: manifest };

        if (entry.packRoot === BetaModuleOutdatedReportsOlderBetaVersion.NESTED_PACK_ROOT) {
            files["World/manifest.json"] = ModelFixture.worldTemplateManifest();
        }

        return ModelFixture.findings(new BetaModuleOutdated(), files, { betaModuleVersions: entry.betaModuleVersions });
    }
}
