import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class FeatureSchema {
    static readonly ROOT_KEYS: readonly string[] = [
        "minecraft:aggregate_feature",
        "minecraft:beehive_feature",
        "minecraft:cave_carver_feature",
        "minecraft:conditional_list",
        "minecraft:fossil_feature",
        "minecraft:geode_feature",
        "minecraft:growing_plant_feature",
        "minecraft:hell_cave_carver_feature",
        "minecraft:multiface_feature",
        "minecraft:nether_cave_carver_feature",
        "minecraft:ore_feature",
        "minecraft:partially_exposed_blob_feature",
        "minecraft:rect_layout",
        "minecraft:scan_surface",
        "minecraft:scatter_feature",
        "minecraft:search_feature",
        "minecraft:sequence_feature",
        "minecraft:single_block_feature",
        "minecraft:snap_to_surface_feature",
        "minecraft:snow_and_freeze_feature",
        "minecraft:structure_template_feature",
        "minecraft:surface_relative_threshold_feature",
        "minecraft:tree_feature",
        "minecraft:underwater_cave_carver_feature",
        "minecraft:vegetation_patch_feature",
        "minecraft:weighted_random_feature",
    ];
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.buildAny(FeatureSchema.ROOT_KEYS, {});
}
