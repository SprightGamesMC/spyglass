import type { BehaviorPackMissingReportsAddonWithoutBehaviorManifestCase } from "../Types/BehaviorPackMissingReportsAddonWithoutBehaviorManifestTypes.js";
import BehaviorPackMissing from "../../src/Checks/Addon/BehaviorPackMissing.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BehaviorPackMissingReportsAddonWithoutBehaviorManifest {
    static readonly ID = "ADDON/101";
    static readonly CASES: readonly BehaviorPackMissingReportsAddonWithoutBehaviorManifestCase[] = [
        { name: "one behavior pack manifest that parses is present", files: AddonFixture.pairFiles(), expectedIds: [] },
        { name: "no manifests at all means the behavior pack is missing", files: {}, expectedIds: ["ADDON/101"] },
        {
            name: "behavior manifest that does not parse counts as a missing behavior pack",
            files: {
                [AddonFixture.BP + "manifest.json"]: "{ not json",
                [AddonFixture.BP + "entities/a.json"]: {},
                [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(),
            },
            expectedIds: ["ADDON/101"],
        },
    ];

    static async run(entry: BehaviorPackMissingReportsAddonWithoutBehaviorManifestCase): Promise<string[]> {
        const summary = await AddonFixture.run(new BehaviorPackMissing(), entry.files);

        return summary.ids;
    }
}
