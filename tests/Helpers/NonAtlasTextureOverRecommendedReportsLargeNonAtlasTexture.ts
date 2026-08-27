import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { NonAtlasTextureOverRecommendedReportsLargeNonAtlasTextureCase } from "../Types/NonAtlasTextureOverRecommendedReportsLargeNonAtlasTextureTypes.js";
import NonAtlasTextureOverRecommended from "../../src/Checks/Texture/NonAtlasTextureOverRecommended.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture {
    static readonly ID = "TEXTURE/401";
    static readonly CASES: readonly NonAtlasTextureOverRecommendedReportsLargeNonAtlasTextureCase[] = [
        {
            name: "2048 by 2048 entity texture is 16 MiB at the non atlas limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(2048, 2048) }),
            expectedIds: [],
        },
        {
            name: "4096 by 4096 blocks texture is part of an atlas so the non atlas limit does not apply",
            files: TextureFixture.resourcePack({ "textures/blocks/big.jpg": TextureFixture.image(4096, 4096) }),
            expectedIds: [],
        },
        {
            name: "4096 by 4096 entity texture is 64 MiB above the 16 MiB non atlas limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(4096, 4096) }),
            expectedIds: [NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture.ID],
            expectedPaths: ["RP/textures/entity/big.jpg"],
        },
    ];

    static run(entry: NonAtlasTextureOverRecommendedReportsLargeNonAtlasTextureCase): Promise<FindingSummary> {
        return TextureFixture.summary(new NonAtlasTextureOverRecommended(), entry);
    }
}
