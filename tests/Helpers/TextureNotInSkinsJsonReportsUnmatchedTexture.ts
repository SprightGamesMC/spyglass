import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureNotInSkinsJsonReportsUnmatchedTextureCase } from "../Types/TextureNotInSkinsJsonReportsUnmatchedTextureTypes.js";
import TextureNotInSkinsJson from "../../src/Checks/Skin/TextureNotInSkinsJson.js";
import ImageBytes from "./Core/ImageBytes.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TextureNotInSkinsJsonReportsUnmatchedTexture {
    static readonly ID = "SKIN/301";
    static readonly CASES: readonly TextureNotInSkinsJsonReportsUnmatchedTextureCase[] = [
        { name: "steve and alex textures are referenced by skins.json and pack_icon.png is exempt", expectedIds: [], expectedPaths: [] },
        {
            name: "extra.png is not referenced by skins.json",
            textures: { ...SkinPackFixture.defaultTextures(), "extra.png": ImageBytes.png({ width: 64, height: 64 }) },
            expectedIds: ["SKIN/301"],
            expectedPaths: [SkinPackFixture.ROOT + "/extra.png"],
        },
        {
            name: "cape.png referenced as a cape in skins.json counts as referenced",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ cape: "cape.png" })]),
            textures: {
                [SkinPackFixture.STEVE_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }),
                "cape.png": ImageBytes.png({ width: 64, height: 32 }),
            },
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static run(entry: TextureNotInSkinsJsonReportsUnmatchedTextureCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TextureNotInSkinsJson(), entry);
    }
}
