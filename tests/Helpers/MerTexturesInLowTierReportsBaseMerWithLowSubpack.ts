import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { MerTexturesInLowTierReportsBaseMerWithLowSubpackCase } from "../Types/MerTexturesInLowTierReportsBaseMerWithLowSubpackTypes.js";
import MerTexturesInLowTier from "../../src/Checks/Texture/MerTexturesInLowTier.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class MerTexturesInLowTierReportsBaseMerWithLowSubpack {
    static readonly ID = "TEXTURE/601";
    static readonly MER_FILES: FixtureFiles = {
        "textures/blocks/stone_mer.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt_material.png": TextureFixture.png(16, 16),
        "textures/blocks/dirt.texture_set.json": {
            "minecraft:texture_set": { color: "dirt", metalness_emissive_roughness: "dirt_material" },
        },
    };
    static readonly CASES: readonly MerTexturesInLowTierReportsBaseMerWithLowSubpackCase[] = [
        {
            name: "MER textures in the base pack with only a tier 3 subpack never load on a low tier",
            files: TextureFixture.resourcePack(MerTexturesInLowTierReportsBaseMerWithLowSubpack.MER_FILES, TextureFixture.subpacks(3)),
            expectedIds: [],
        },
        {
            name: "tier 1 subpack in a pack with no MER textures has nothing to load on a low tier",
            files: TextureFixture.resourcePack({ "textures/blocks/dirt.png": TextureFixture.png(16, 16) }, TextureFixture.subpacks(1)),
            expectedIds: [],
        },
        {
            name: "base pack stone_mer.png and dirt_material.png load with the tier 1 subpack on a low tier",
            files: TextureFixture.resourcePack(MerTexturesInLowTierReportsBaseMerWithLowSubpack.MER_FILES, TextureFixture.subpacks(1, 3)),
            expectedIds: [MerTexturesInLowTierReportsBaseMerWithLowSubpack.ID, MerTexturesInLowTierReportsBaseMerWithLowSubpack.ID],
            expectedPaths: ["RP/textures/blocks/dirt_material.png", "RP/textures/blocks/stone_mer.png"],
        },
        {
            name: "stone_mer.png inside the tier 0 subpack loads on a low tier",
            files: TextureFixture.resourcePack(
                { "subpacks/tier0/textures/blocks/stone_mer.png": TextureFixture.png(16, 16) },
                TextureFixture.subpacks(0)
            ),
            expectedIds: [MerTexturesInLowTierReportsBaseMerWithLowSubpack.ID],
            expectedPaths: ["RP/subpacks/tier0/textures/blocks/stone_mer.png"],
        },
    ];

    static run(entry: MerTexturesInLowTierReportsBaseMerWithLowSubpackCase): Promise<FindingSummary> {
        return TextureFixture.summary(new MerTexturesInLowTier(), entry);
    }
}
