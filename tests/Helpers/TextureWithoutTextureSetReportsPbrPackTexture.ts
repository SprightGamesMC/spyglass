import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { TextureWithoutTextureSetReportsPbrPackTextureCase } from "../Types/TextureWithoutTextureSetReportsPbrPackTextureTypes.js";
import TextureWithoutTextureSet from "../../src/Checks/Texture/TextureWithoutTextureSet.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TextureWithoutTextureSetReportsPbrPackTexture {
    static readonly ID = "TEXTURE/304";
    static readonly FILES: FixtureFiles = {
        "textures/blocks/stone.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt_mer.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt.texture_set.json": { "minecraft:texture_set": { color: "dirt", metalness_emissive_roughness: "dirt_mer" } },
        "textures/items/apple.png": TextureFixture.png(16, 16),
    };
    static readonly CASES: readonly TextureWithoutTextureSetReportsPbrPackTextureCase[] = [
        {
            name: "stone.png without a texture set in a pack without the pbr capability needs no texture set",
            files: TextureFixture.resourcePack(TextureWithoutTextureSetReportsPbrPackTexture.FILES),
            expectedIds: [],
        },
        {
            name: "stone.png without a texture set in a pack with the pbr capability is missing a texture set",
            files: TextureFixture.resourcePack(TextureWithoutTextureSetReportsPbrPackTexture.FILES, { capabilities: ["pbr"] }),
            expectedIds: [TextureWithoutTextureSetReportsPbrPackTexture.ID],
            expectedPaths: ["RP/textures/blocks/stone.png"],
        },
    ];

    static run(entry: TextureWithoutTextureSetReportsPbrPackTextureCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TextureWithoutTextureSet(), entry);
    }
}
