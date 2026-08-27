import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class SpawnRuleSchema {
    static readonly ROOT_KEY = "minecraft:spawn_rules";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(SpawnRuleSchema.ROOT_KEY, {
        conditions: { type: "array" },
    });
}
