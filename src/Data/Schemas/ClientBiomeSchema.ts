import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class ClientBiomeSchema {
    static readonly ROOT_KEY = "minecraft:client_biome";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(ClientBiomeSchema.ROOT_KEY, {
        components: { type: "object" },
    });
}
