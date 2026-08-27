import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TierTotalOverRecommendedReportsAddonOverTierLimitCase } from "../Types/TierTotalOverRecommendedReportsAddonOverTierLimitTypes.js";
import TierTotalOverRecommended from "../../src/Checks/Texture/TierTotalOverRecommended.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TierTotalOverRecommendedReportsAddonOverTierLimit {
    static readonly ID = "TEXTURE/406";
    static readonly CASES: readonly TierTotalOverRecommendedReportsAddonOverTierLimitCase[] = [
        {
            name: "64 MiB addon is under the 150 MiB tier 0 limit and every higher tier",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(4096, 4096) }),
            expectedIds: [],
        },
        {
            name: "256 MiB texture pack is under the 350 MiB tier 0 limit of the texture pack table",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }),
            options: { contentType: "texture" },
            expectedIds: [],
        },
        {
            name: "256 MiB addon without subpacks is over the limit for tiers 0 to 2",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }),
            expectedIds: [
                TierTotalOverRecommendedReportsAddonOverTierLimit.ID,
                TierTotalOverRecommendedReportsAddonOverTierLimit.ID,
                TierTotalOverRecommendedReportsAddonOverTierLimit.ID,
            ],
            expectedPaths: ["RP/manifest.json", "RP/manifest.json", "RP/manifest.json"],
        },
    ];

    static run(entry: TierTotalOverRecommendedReportsAddonOverTierLimitCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TierTotalOverRecommended(), entry);
    }
}
