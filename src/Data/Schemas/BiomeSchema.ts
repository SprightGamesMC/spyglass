import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class BiomeSchema {
    static readonly ROOT_KEY = "minecraft:biome";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(BiomeSchema.ROOT_KEY, {
        components: { type: "object" },
    });
}
