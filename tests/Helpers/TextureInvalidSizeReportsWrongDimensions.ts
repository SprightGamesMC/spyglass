import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureInvalidSizeReportsWrongDimensionsCase } from "../Types/TextureInvalidSizeReportsWrongDimensionsTypes.js";
import TextureInvalidSize from "../../src/Checks/Skin/TextureInvalidSize.js";
import ImageBytes from "./Core/ImageBytes.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TextureInvalidSizeReportsWrongDimensions {
    static readonly ID = "SKIN/203";
    static readonly CASES: readonly TextureInvalidSizeReportsWrongDimensionsCase[] = [
        { name: "64x64 skin textures are an allowed skin size", expectedIds: [], expectedPaths: [] },
        {
            name: "128x128 and 64x32 skin textures are allowed skin sizes",
            textures: {
                [SkinPackFixture.STEVE_TEXTURE]: ImageBytes.png({ width: 128, height: 128 }),
                [SkinPackFixture.ALEX_TEXTURE]: ImageBytes.png({ width: 64, height: 32 }),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "32x32 skin texture is not 64x64 64x32 or 128x128",
            textures: {
                [SkinPackFixture.STEVE_TEXTURE]: ImageBytes.png({ width: 32, height: 32 }),
                [SkinPackFixture.ALEX_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }),
            },
            expectedIds: ["SKIN/203"],
            expectedPaths: [SkinPackFixture.ROOT + "/" + SkinPackFixture.STEVE_TEXTURE],
        },
        {
            name: "64x32 cape texture is the allowed cape size",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ cape: "cape.png" })]),
            textures: { ...SkinPackFixture.defaultTextures(), "cape.png": ImageBytes.png({ width: 64, height: 32 }) },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "64x64 cape texture is not 64x32",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ cape: "cape.png" })]),
            textures: { ...SkinPackFixture.defaultTextures(), "cape.png": ImageBytes.png({ width: 64, height: 64 }) },
            expectedIds: ["SKIN/203"],
            expectedPaths: [SkinPackFixture.ROOT + "/cape.png"],
        },
    ];

    static run(entry: TextureInvalidSizeReportsWrongDimensionsCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TextureInvalidSize(), entry);
    }
}
