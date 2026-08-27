import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { AtlasTotalOverRecommendedReportsRoundedBlockAtlasCase } from "../Types/AtlasTotalOverRecommendedReportsRoundedBlockAtlasTypes.js";
import AtlasTotalOverRecommended from "../../src/Checks/Texture/AtlasTotalOverRecommended.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class AtlasTotalOverRecommendedReportsRoundedBlockAtlas {
    static readonly ID = "TEXTURE/404";
    static readonly CASES: readonly AtlasTotalOverRecommendedReportsRoundedBlockAtlasCase[] = [
        {
            name: "4096 by 4096 block atlas is at the recommended 64 MiB",
            files: TextureFixture.resourcePack({ "textures/blocks/a.jpg": TextureFixture.image(4096, 4096) }),
            expectedIds: [],
        },
        {
            name: "8192 by 8192 item atlas plus one 16 by 16 texture rounds above the 256 MiB limit which TEXTURE/405 reports instead",
            files: TextureFixture.resourcePack({
                "textures/items/a.jpg": TextureFixture.image(8192, 8192),
                "textures/items/b.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [],
        },
        {
            name: "4096 by 4096 block atlas plus one 16 by 16 texture rounds to 8192 which is above the recommended 64 MiB but at the 256 MiB limit",
            files: TextureFixture.resourcePack({
                "textures/blocks/a.jpg": TextureFixture.image(4096, 4096),
                "textures/blocks/b.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [AtlasTotalOverRecommendedReportsRoundedBlockAtlas.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static run(entry: AtlasTotalOverRecommendedReportsRoundedBlockAtlasCase): Promise<FindingSummary> {
        return TextureFixture.summary(new AtlasTotalOverRecommended(), entry);
    }
}
