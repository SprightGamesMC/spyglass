import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureSetLayerNotFoundReportsMissingLayerFileCase } from "../Types/TextureSetLayerNotFoundReportsMissingLayerFileTypes.js";
import TextureSetLayerNotFound from "../../src/Checks/Texture/TextureSetLayerNotFound.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TextureSetLayerNotFoundReportsMissingLayerFile {
    static readonly ID = "TEXTURE/305";
    static readonly FIELD = "minecraft:texture_set.metalness_emissive_roughness";
    static readonly CASES: readonly TextureSetLayerNotFoundReportsMissingLayerFileCase[] = [
        {
            name: "stone_mer and stone layer files listed in the texture set exist",
            files: TextureFixture.resourcePack({
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone_mer.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": {
                    "minecraft:texture_set": {
                        color: [1, 2, 3, 255],
                        metalness_emissive_roughness: "stone_mer",
                        normal: "textures/blocks/stone",
                    },
                },
            }),
            expectedIds: [],
        },
        {
            name: "the metalness_emissive_roughness layer holds a color so it names no file",
            files: TextureFixture.resourcePack({
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": {
                    "minecraft:texture_set": { color: "stone", metalness_emissive_roughness: "#0501a4" },
                },
            }),
            expectedIds: [],
        },
        {
            name: "stone_mer metalness_emissive_roughness layer file is not in the pack",
            files: TextureFixture.resourcePack({
                "textures/blocks/stone.png": TextureFixture.png(16, 16),
                "textures/blocks/stone.texture_set.json": {
                    "minecraft:texture_set": { color: "stone", metalness_emissive_roughness: "stone_mer" },
                },
            }),
            expectedIds: [TextureSetLayerNotFoundReportsMissingLayerFile.ID],
            expectedPaths: ["RP/textures/blocks/stone.texture_set.json"],
        },
    ];

    static run(entry: TextureSetLayerNotFoundReportsMissingLayerFileCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TextureSetLayerNotFound(), entry);
    }
}
