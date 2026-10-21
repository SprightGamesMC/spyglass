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
        "textures/example/sample/entity/cow.png": TextureFixture.png(16, 16),
        "textures/example/sample/ui/panel.png": TextureFixture.png(16, 16),
        "textures/example/creature.png": TextureFixture.png(16, 16),
        "textures/example/unused.png": TextureFixture.png(16, 16),
        "entity/creature.entity.json": {
            "minecraft:client_entity": {
                description: { identifier: "example:creature", textures: { default: "textures/example/creature" } },
            },
        },
    };
    static readonly CASES: readonly TextureWithoutTextureSetReportsPbrPackTextureCase[] = [
        {
            name: "stone.png without a texture set in a pack without the pbr capability needs no texture set",
            files: TextureFixture.resourcePack(TextureWithoutTextureSetReportsPbrPackTexture.FILES),
            expectedIds: [],
        },
        {
            name: "block, item, add-on folder entity, and client entity textures without a texture set in a pack with the pbr capability are missing a texture set",
            files: TextureFixture.resourcePack(TextureWithoutTextureSetReportsPbrPackTexture.FILES, { capabilities: ["pbr"] }),
            expectedIds: [
                TextureWithoutTextureSetReportsPbrPackTexture.ID,
                TextureWithoutTextureSetReportsPbrPackTexture.ID,
                TextureWithoutTextureSetReportsPbrPackTexture.ID,
                TextureWithoutTextureSetReportsPbrPackTexture.ID,
            ],
            expectedPaths: [
                "RP/textures/blocks/stone.png",
                "RP/textures/example/creature.png",
                "RP/textures/example/sample/entity/cow.png",
                "RP/textures/items/apple.png",
            ],
        },
    ];

    static run(entry: TextureWithoutTextureSetReportsPbrPackTextureCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TextureWithoutTextureSet(), entry);
    }
}
