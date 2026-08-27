import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class RecipeSchema {
    static readonly ROOT_KEYS: readonly string[] = [
        "minecraft:recipe_shaped",
        "minecraft:recipe_shapeless",
        "minecraft:recipe_furnace",
        "minecraft:recipe_brewing_mix",
        "minecraft:recipe_brewing_container",
        "minecraft:recipe_smithing_transform",
        "minecraft:recipe_smithing_trim",
    ];
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.buildAny(RecipeSchema.ROOT_KEYS, {
        tags: { type: "array" },
    });
}
