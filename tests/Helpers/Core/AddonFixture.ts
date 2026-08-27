import type Check from "../../../src/Checks/Check.js";
import type { DependencyCase, PackPathCase, SizeCase } from "../../Types/Core/AddonFixtureTypes.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class AddonFixture {
    static readonly BP = "Content/behavior_packs/BP_T/";
    static readonly RP = "Content/resource_packs/RP_T/";
    static readonly SCRIPT_DEPENDENCY = { module_name: "@minecraft/server", version: "1.0.0" };

    static pairFiles(extra: FixtureFiles = {}): FixtureFiles {
        return {
            [AddonFixture.BP + "manifest.json"]: ModelFixture.behaviorManifest(),
            [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(),
            ...extra,
        };
    }

    static dependencyFiles(entry: DependencyCase): FixtureFiles {
        const behaviorOverrides = entry.behaviorDependencies === undefined ? {} : { dependencies: entry.behaviorDependencies };
        const resourceOverrides = entry.resourceDependencies === undefined ? {} : { dependencies: entry.resourceDependencies };

        return {
            [AddonFixture.BP + "manifest.json"]: ModelFixture.behaviorManifest(behaviorOverrides),
            [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(resourceOverrides),
        };
    }

    static packPathFiles(entry: PackPathCase): FixtureFiles {
        const root = entry.packType === "behavior" ? AddonFixture.BP : AddonFixture.RP;
        const manifest = entry.packType === "behavior" ? ModelFixture.behaviorManifest() : ModelFixture.resourceManifest();
        const files: Record<string, string | object> = { [root + "manifest.json"]: manifest };

        for (const path of entry.paths) {
            files[root + path] = path.endsWith(".json") ? {} : "x";
        }

        return files;
    }

    static sizedFiles(entry: SizeCase): FixtureFiles {
        const files: Record<string, Uint8Array | object> = { [AddonFixture.BP + "manifest.json"]: ModelFixture.behaviorManifest() };

        for (let index = 0; index < entry.fileCount; index += 1) {
            files[AddonFixture.BP + "structures/spright_cave/s" + index + ".mcstructure"] = new Uint8Array(entry.fileSize);
        }

        if (entry.artSize > 0) {
            files["Marketing Art/Test_MarketingKeyArt.jpg"] = new Uint8Array(entry.artSize);
        }

        return files;
    }

    static run(check: Check, files: FixtureFiles): Promise<FindingSummary> {
        return ModelFixture.summary(check, files, { layout: "marketplace" });
    }
}
