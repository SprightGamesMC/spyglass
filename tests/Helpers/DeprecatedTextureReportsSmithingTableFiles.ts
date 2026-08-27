import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { DeprecatedTextureReportsSmithingTableFilesCase } from "../Types/DeprecatedTextureReportsSmithingTableFilesTypes.js";
import DeprecatedTexture from "../../src/Checks/Texture/DeprecatedTexture.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class DeprecatedTextureReportsSmithingTableFiles {
    static readonly ID = "TEXTURE/501";
    static readonly CASES: readonly DeprecatedTextureReportsSmithingTableFilesCase[] = [
        {
            name: "stone.png and stone entry are not deprecated names",
            files: TextureFixture.resourcePack({
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/terrain_texture.json": { texture_data: { stone: { textures: "textures/blocks/stone" } } },
            }),
            expectedIds: [],
        },
        {
            name: "smithing_table_top.png under textures/entity is outside textures/blocks",
            files: TextureFixture.resourcePack({ "textures/entity/smithing_table_top.png": TextureFixture.png(16, 16) }),
            expectedIds: [],
        },
        {
            name: "smithing_table_top.png under textures/blocks and fletching_table_top entry are deprecated names",
            files: TextureFixture.resourcePack({
                "textures/blocks/smithing_table_top.png": TextureFixture.png(16, 16),
                "textures/terrain_texture.json": {
                    texture_data: { fletching_table_top: { textures: "textures/blocks/fletching_table_top" } },
                },
            }),
            expectedIds: [DeprecatedTextureReportsSmithingTableFiles.ID, DeprecatedTextureReportsSmithingTableFiles.ID],
            expectedPaths: ["RP/textures/blocks/smithing_table_top.png", "RP/textures/terrain_texture.json"],
        },
    ];

    static run(entry: DeprecatedTextureReportsSmithingTableFilesCase): Promise<FindingSummary> {
        return TextureFixture.summary(new DeprecatedTexture(), entry);
    }
}
