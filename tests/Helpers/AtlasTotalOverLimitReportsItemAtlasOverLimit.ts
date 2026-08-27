import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { AtlasTotalOverLimitReportsItemAtlasOverLimitCase } from "../Types/AtlasTotalOverLimitReportsItemAtlasOverLimitTypes.js";
import AtlasTotalOverLimit from "../../src/Checks/Texture/AtlasTotalOverLimit.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class AtlasTotalOverLimitReportsItemAtlasOverLimit {
    static readonly ID = "TEXTURE/405";
    static readonly CASES: readonly AtlasTotalOverLimitReportsItemAtlasOverLimitCase[] = [
        {
            name: "4096 by 4096 block atlas plus one 16 by 16 texture rounds to 8192 which is at the 256 MiB limit",
            files: TextureFixture.resourcePack({
                "textures/blocks/a.jpg": TextureFixture.image(4096, 4096),
                "textures/blocks/b.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [],
        },
        {
            name: "8192 by 8192 item atlas plus one 16 by 16 texture rounds to 16384 which is above the 256 MiB limit",
            files: TextureFixture.resourcePack({
                "textures/items/a.jpg": TextureFixture.image(8192, 8192),
                "textures/items/b.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [AtlasTotalOverLimitReportsItemAtlasOverLimit.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static run(entry: AtlasTotalOverLimitReportsItemAtlasOverLimitCase): Promise<FindingSummary> {
        return TextureFixture.summary(new AtlasTotalOverLimit(), entry);
    }
}
