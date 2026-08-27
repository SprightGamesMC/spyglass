import type { MultipleResourcePacksReportsSecondAddonResourceManifestCase } from "../Types/MultipleResourcePacksReportsSecondAddonResourceManifestTypes.js";
import MultipleResourcePacks from "../../src/Checks/Addon/MultipleResourcePacks.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleResourcePacksReportsSecondAddonResourceManifest {
    static readonly ID = "ADDON/602";
    static readonly CASES: readonly MultipleResourcePacksReportsSecondAddonResourceManifestCase[] = [
        { name: "one resource pack is the expected count", files: AddonFixture.pairFiles(), expectedIds: [] },
        {
            name: "two resource packs is more than one",
            files: AddonFixture.pairFiles({ "Content/resource_packs/RP_U/manifest.json": ModelFixture.resourceManifest() }),
            expectedIds: ["ADDON/602", "ADDON/602"],
        },
    ];

    static async run(entry: MultipleResourcePacksReportsSecondAddonResourceManifestCase): Promise<string[]> {
        const summary = await AddonFixture.run(new MultipleResourcePacks(), entry.files);

        return summary.ids;
    }
}
