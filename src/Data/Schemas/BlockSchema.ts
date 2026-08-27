import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class BlockSchema {
    static readonly ROOT_KEY = "minecraft:block";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(BlockSchema.ROOT_KEY, {
        components: { type: "object" },
        permutations: { type: "array" },
        events: { type: "object" },
    });
}
