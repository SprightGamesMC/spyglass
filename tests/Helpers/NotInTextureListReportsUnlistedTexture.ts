import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { NotInTextureListReportsUnlistedTextureCase } from "../Types/NotInTextureListReportsUnlistedTextureTypes.js";
import NotInTextureList from "../../src/Checks/Texture/NotInTextureList.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class NotInTextureListReportsUnlistedTexture {
    static readonly ID = "TEXTURE/301";
    static readonly CASES: readonly NotInTextureListReportsUnlistedTextureCase[] = [
        {
            name: "pack without texture_list.json has no list to be missing from",
            files: TextureFixture.resourcePack({ "textures/blocks/dirt.png": TextureFixture.png(16, 16) }),
            expectedIds: [],
        },
        {
            name: "stone.png listed as Textures/Blocks/Stone.png matches the list ignoring case and extension",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["Textures/Blocks/Stone.png"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [],
        },
        {
            name: "glyph image in the font folder is outside the textures folder and is not checked",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["textures/blocks/stone"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "font/glyph_E1.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [],
        },
        {
            name: "dirt.png is missing from texture_list.json while its _mer and normal companions are exempt",
            files: TextureFixture.resourcePack({
                "textures/texture_list.json": ["textures/blocks/stone"],
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/dirt.png": TextureFixture.png(16, 16),
                "textures/blocks/dirt_mer.png": TextureFixture.png(16, 16),
                "textures/blocks/dirt.texture_set.json": { "minecraft:texture_set": { color: "dirt", normal: "dirt_n" } },
                "textures/blocks/dirt_n.png": TextureFixture.png(16, 16),
            }),
            expectedIds: [NotInTextureListReportsUnlistedTexture.ID],
            expectedPaths: ["RP/textures/blocks/dirt.png"],
        },
        {
            name: "subpack texture listed in the textures_list.json of that subpack is listed",
            files: TextureFixture.resourcePack(
                {
                    "textures/texture_list.json": ["textures/blocks/stone"],
                    "textures/blocks/stone.png": TextureFixture.png(16, 16),
                    "subpacks/tier2/textures/textures_list.json": ["textures/ui/tab"],
                    "subpacks/tier2/textures/ui/tab.png": TextureFixture.png(16, 16),
                },
                TextureFixture.subpacks(2)
            ),
            expectedIds: [],
        },
        {
            name: "subpack texture in no list is missing from texture_list.json",
            files: TextureFixture.resourcePack(
                {
                    "textures/texture_list.json": ["textures/blocks/stone"],
                    "textures/blocks/stone.png": TextureFixture.png(16, 16),
                    "subpacks/tier2/textures/textures_list.json": ["textures/ui/tab"],
                    "subpacks/tier2/textures/ui/tab.png": TextureFixture.png(16, 16),
                    "subpacks/tier2/textures/ui/panel.png": TextureFixture.png(16, 16),
                },
                TextureFixture.subpacks(2)
            ),
            expectedIds: [NotInTextureListReportsUnlistedTexture.ID],
            expectedPaths: ["RP/subpacks/tier2/textures/ui/panel.png"],
        },
        {
            name: "base texture listed only in a subpack list is missing from the base texture_list.json",
            files: TextureFixture.resourcePack(
                {
                    "textures/texture_list.json": ["textures/blocks/stone"],
                    "textures/blocks/stone.png": TextureFixture.png(16, 16),
                    "textures/ui/tab.png": TextureFixture.png(16, 16),
                    "subpacks/tier2/textures/textures_list.json": ["textures/ui/tab"],
                },
                TextureFixture.subpacks(2)
            ),
            expectedIds: [NotInTextureListReportsUnlistedTexture.ID],
            expectedPaths: ["RP/textures/ui/tab.png"],
        },
    ];

    static run(entry: NotInTextureListReportsUnlistedTextureCase): Promise<FindingSummary> {
        return TextureFixture.summary(new NotInTextureList(), entry);
    }
}
