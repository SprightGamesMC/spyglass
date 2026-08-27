import type { VanillaData } from "../../../src/Types/LoaderTypes.js";
import type { FixtureFiles, FixtureOptions } from "../../Types/Core/FixtureTypes.js";
import TextureFixture from "./TextureFixture.js";

export default abstract class VanillaTextureFixture {
    static readonly VANILLA: VanillaData = {
        files: {
            "textures/blocks/stone.png": "1",
            "textures/blocks/dirt.png": "2",
            "textures/blocks/dirt_mer.png": "3",
            "textures/ui/icon.png": "4",
            "textures/entity/villager/farmer.png": "5",
        },
        properties: {},
    };
    static readonly OPTIONS: FixtureOptions = { contentType: "texture", vanilla: VanillaTextureFixture.VANILLA };

    static fullCoverage(): FixtureFiles {
        return TextureFixture.resourcePack({
            "textures/blocks/stone.png": TextureFixture.png(16, 16),
            "textures/blocks/dirt.tga": TextureFixture.png(16, 16),
        });
    }

    static stoneOnly(): FixtureFiles {
        return TextureFixture.resourcePack({ "textures/blocks/stone.png": TextureFixture.png(16, 16) });
    }
}
