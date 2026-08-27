import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class ItemSchema {
    static readonly ROOT_KEY = "minecraft:item";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(ItemSchema.ROOT_KEY, {
        components: { type: "object" },
        events: { type: "object" },
    });
}
