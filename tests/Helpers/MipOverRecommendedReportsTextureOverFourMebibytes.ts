import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MipOverRecommendedReportsTextureOverFourMebibytesCase } from "../Types/MipOverRecommendedReportsTextureOverFourMebibytesTypes.js";
import MipOverRecommended from "../../src/Checks/Texture/MipOverRecommended.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class MipOverRecommendedReportsTextureOverFourMebibytes {
    static readonly ID = "TEXTURE/403";
    static readonly CASES: readonly MipOverRecommendedReportsTextureOverFourMebibytesCase[] = [
        {
            name: "1024 by 1024 texture is 4 MiB at the highest mip limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(1024, 1024) }),
            expectedIds: [],
        },
        {
            name: "2048 by 2048 texture is 16 MiB above the 4 MiB highest mip limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(2048, 2048) }),
            expectedIds: [MipOverRecommendedReportsTextureOverFourMebibytes.ID],
            expectedPaths: ["RP/textures/entity/big.jpg"],
        },
    ];

    static run(entry: MipOverRecommendedReportsTextureOverFourMebibytesCase): Promise<FindingSummary> {
        return TextureFixture.summary(new MipOverRecommended(), entry);
    }
}
