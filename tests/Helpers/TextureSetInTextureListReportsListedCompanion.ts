import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureSetInTextureListReportsListedCompanionCase } from "../Types/TextureSetInTextureListReportsListedCompanionTypes.js";
import TextureSetInTextureList from "../../src/Checks/Texture/TextureSetInTextureList.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TextureSetInTextureListReportsListedCompanion {
    static readonly ID = "TEXTURE/302";
    static readonly CASES: readonly TextureSetInTextureListReportsListedCompanionCase[] = [
        {
            name: "texture_list.json naming only stone leaves the stone_n companion unlisted",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["textures/blocks/stone"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone_n.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": { "minecraft:texture_set": { color: "stone", normal: "stone_n" } },
            }),
            expectedIds: [],
        },
        {
            name: "texture_list.json naming stone_n.png lists a texture set normal companion",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["textures/blocks/stone", "textures/blocks/stone_n.png"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone_n.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": { "minecraft:texture_set": { color: "stone", normal: "stone_n" } },
            }),
            expectedIds: [TextureSetInTextureListReportsListedCompanion.ID],
            expectedPaths: ["RP/textures/texture_list.json"],
        },
        {
            name: "second list textures_list.json naming stone_n is reported on that second list file",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["textures/blocks/stone"],
                "textures/textures_list.json": ["textures/blocks/stone_n"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone_n.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": { "minecraft:texture_set": { color: "stone", normal: "stone_n" } },
            }),
            expectedIds: [TextureSetInTextureListReportsListedCompanion.ID],
            expectedPaths: ["RP/textures/textures_list.json"],
        },
    ];

    static run(entry: TextureSetInTextureListReportsListedCompanionCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TextureSetInTextureList(), entry);
    }
}
