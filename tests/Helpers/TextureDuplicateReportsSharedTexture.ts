import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureDuplicateReportsSharedTextureCase } from "../Types/TextureDuplicateReportsSharedTextureTypes.js";
import TextureDuplicate from "../../src/Checks/Skin/TextureDuplicate.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TextureDuplicateReportsSharedTexture {
    static readonly ID = "SKIN/601";
    static readonly CASES: readonly TextureDuplicateReportsSharedTextureCase[] = [
        { name: "steve and alex skins with their own texture files share no texture", expectedIds: [], expectedPaths: [] },
        {
            name: "two skins using the same skin texture file share a texture",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin(), SkinPackFixture.skin({ localization_name: "TestSkin2" })]),
            expectedIds: ["SKIN/601"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
        {
            name: "two skins using the same cape.png share a texture",
            skinsJson: SkinPackFixture.skinsJson([
                SkinPackFixture.skin({ cape: "cape.png" }),
                SkinPackFixture.skin({ localization_name: "TestSkin2", texture: SkinPackFixture.ALEX_TEXTURE, cape: "cape.png" }),
            ]),
            expectedIds: ["SKIN/601"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: TextureDuplicateReportsSharedTextureCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TextureDuplicate(), entry);
    }
}
