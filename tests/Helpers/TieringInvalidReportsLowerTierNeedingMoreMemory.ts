import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TieringInvalidReportsLowerTierNeedingMoreMemoryCase } from "../Types/TieringInvalidReportsLowerTierNeedingMoreMemoryTypes.js";
import TieringInvalid from "../../src/Checks/Texture/TieringInvalid.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TieringInvalidReportsLowerTierNeedingMoreMemory {
    static readonly ID = "TEXTURE/202";
    static readonly CASES: readonly TieringInvalidReportsLowerTierNeedingMoreMemoryCase[] = [
        {
            name: "256 MiB tier 3 subpack over a 64 MiB base needs more memory than the lower tiers",
            files: TextureFixture.resourcePack(
                {
                    "textures/entity/big.jpg": TextureFixture.image(4096, 4096),
                    "subpacks/tier3/textures/entity/big.jpg": TextureFixture.image(8192, 8192),
                },
                TextureFixture.subpacks(3)
            ),
            expectedIds: [],
        },
        {
            name: "16 px tier 3 subpack under a 64 MiB base leaves tiers 0 to 2 needing more memory than tier 3",
            files: TextureFixture.resourcePack(
                {
                    "textures/entity/big.jpg": TextureFixture.image(4096, 4096),
                    "subpacks/tier3/textures/entity/big.jpg": TextureFixture.image(16, 16),
                },
                TextureFixture.subpacks(3)
            ),
            expectedIds: [
                TieringInvalidReportsLowerTierNeedingMoreMemory.ID,
                TieringInvalidReportsLowerTierNeedingMoreMemory.ID,
                TieringInvalidReportsLowerTierNeedingMoreMemory.ID,
            ],
            expectedPaths: ["RP/manifest.json", "RP/manifest.json", "RP/manifest.json"],
        },
    ];

    static run(entry: TieringInvalidReportsLowerTierNeedingMoreMemoryCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TieringInvalid(), entry);
    }
}
