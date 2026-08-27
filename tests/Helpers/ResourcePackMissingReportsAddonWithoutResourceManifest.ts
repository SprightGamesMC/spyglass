import type { ResourcePackMissingReportsAddonWithoutResourceManifestCase } from "../Types/ResourcePackMissingReportsAddonWithoutResourceManifestTypes.js";
import ResourcePackMissing from "../../src/Checks/Addon/ResourcePackMissing.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ResourcePackMissingReportsAddonWithoutResourceManifest {
    static readonly ID = "ADDON/102";
    static readonly CASES: readonly ResourcePackMissingReportsAddonWithoutResourceManifestCase[] = [
        { name: "one resource pack manifest that parses is present", files: AddonFixture.pairFiles(), expectedIds: [] },
        {
            name: "behavior pack only means the resource pack is missing",
            files: { [AddonFixture.BP + "manifest.json"]: ModelFixture.behaviorManifest() },
            expectedIds: ["ADDON/102"],
        },
    ];

    static async run(entry: ResourcePackMissingReportsAddonWithoutResourceManifestCase): Promise<string[]> {
        const summary = await AddonFixture.run(new ResourcePackMissing(), entry.files);

        return summary.ids;
    }
}
