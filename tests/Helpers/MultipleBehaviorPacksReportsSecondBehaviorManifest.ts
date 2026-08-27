import type { MultipleBehaviorPacksReportsSecondBehaviorManifestCase } from "../Types/MultipleBehaviorPacksReportsSecondBehaviorManifestTypes.js";
import MultipleBehaviorPacks from "../../src/Checks/Addon/MultipleBehaviorPacks.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleBehaviorPacksReportsSecondBehaviorManifest {
    static readonly ID = "ADDON/601";
    static readonly CASES: readonly MultipleBehaviorPacksReportsSecondBehaviorManifestCase[] = [
        { name: "one behavior pack is the expected count", files: AddonFixture.pairFiles(), expectedIds: [] },
        {
            name: "two behavior packs is more than one",
            files: AddonFixture.pairFiles({ "Content/behavior_packs/BP_U/manifest.json": ModelFixture.behaviorManifest() }),
            expectedIds: ["ADDON/601", "ADDON/601"],
        },
    ];

    static async run(entry: MultipleBehaviorPacksReportsSecondBehaviorManifestCase): Promise<string[]> {
        const summary = await AddonFixture.run(new MultipleBehaviorPacks(), entry.files);

        return summary.ids;
    }
}
