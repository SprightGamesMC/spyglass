import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class EntitySchema {
    static readonly ROOT_KEY = "minecraft:entity";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(EntitySchema.ROOT_KEY, {
        components: { type: "object" },
        component_groups: { type: "object" },
        events: { type: "object" },
    });
}
