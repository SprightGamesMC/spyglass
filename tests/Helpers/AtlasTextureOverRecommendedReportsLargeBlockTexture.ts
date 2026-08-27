import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { AtlasTextureOverRecommendedReportsLargeBlockTextureCase } from "../Types/AtlasTextureOverRecommendedReportsLargeBlockTextureTypes.js";
import AtlasTextureOverRecommended from "../../src/Checks/Texture/AtlasTextureOverRecommended.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class AtlasTextureOverRecommendedReportsLargeBlockTexture {
    static readonly ID = "TEXTURE/402";
    static readonly CASES: readonly AtlasTextureOverRecommendedReportsLargeBlockTextureCase[] = [
        {
            name: "256 by 256 block texture is at the 256 KiB atlas texture limit",
            files: TextureFixture.resourcePack({ "textures/blocks/stone.png": TextureFixture.png(256, 256) }),
            expectedIds: [],
        },
        {
            name: "512 by 512 entity texture is not in an atlas so the limit does not apply",
            files: TextureFixture.resourcePack({ "textures/entity/steve.png": TextureFixture.png(512, 512) }),
            expectedIds: [],
        },
        {
            name: "512 by 512 block texture is above the 256 KiB atlas texture limit",
            files: TextureFixture.resourcePack({ "textures/blocks/stone.png": TextureFixture.png(512, 512) }),
            expectedIds: [AtlasTextureOverRecommendedReportsLargeBlockTexture.ID],
            expectedPaths: ["RP/textures/blocks/stone.png"],
        },
        {
            name: "512 by 512 texture referenced from terrain_texture.json is in the block atlas and above the limit",
            files: TextureFixture.resourcePack({
                "textures/custom/stone.png": TextureFixture.png(512, 512),
                "textures/terrain_texture.json": { texture_data: { stone: { textures: "textures/custom/stone" } } },
            }),
            expectedIds: [AtlasTextureOverRecommendedReportsLargeBlockTexture.ID],
            expectedPaths: ["RP/textures/custom/stone.png"],
        },
    ];

    static run(entry: AtlasTextureOverRecommendedReportsLargeBlockTextureCase): Promise<FindingSummary> {
        return TextureFixture.summary(new AtlasTextureOverRecommended(), entry);
    }
}
