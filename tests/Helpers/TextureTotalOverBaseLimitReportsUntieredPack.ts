import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureTotalOverBaseLimitReportsUntieredPackCase } from "../Types/TextureTotalOverBaseLimitReportsUntieredPackTypes.js";
import TextureTotalOverBaseLimit from "../../src/Checks/Addon/TextureTotalOverBaseLimit.js";
import AddonFixture from "./Core/AddonFixture.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class TextureTotalOverBaseLimitReportsUntieredPack {
    static readonly ID = "ADDON/406";
    static readonly CASES: readonly TextureTotalOverBaseLimitReportsUntieredPackCase[] = [
        { name: "64 px texture without a tier is under the 150 MiB base limit", imageSide: 64, declaresTier: false, expectedIds: [] },
        {
            name: "256 MiB texture without a declared tier is over the 150 MiB base limit",
            imageSide: 8192,
            declaresTier: false,
            expectedIds: ["ADDON/406"],
        },
        {
            name: "256 MiB texture with a declared tier 3 subpack is not checked against the base limit",
            imageSide: 8192,
            declaresTier: true,
            expectedIds: [],
        },
    ];

    static async run(entry: TextureTotalOverBaseLimitReportsUntieredPackCase): Promise<FindingSummary> {
        const subpacks = entry.declaresTier ? { subpacks: [{ folder_name: "high", name: "High", memory_tier: 3 }] } : {};
        const files = {
            [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(subpacks),
            [AddonFixture.RP + "textures/entity/spright_cave/big.jpg"]: ImageBytes.jpeg({
                width: entry.imageSide,
                height: entry.imageSide,
            }),
        };

        return AddonFixture.run(new TextureTotalOverBaseLimit(), files);
    }
}
