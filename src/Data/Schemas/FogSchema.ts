import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class FogSchema {
    static readonly ROOT_KEY = "minecraft:fog_settings";
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(FogSchema.ROOT_KEY, {
        distance: { type: "object" },
        volumetric: { type: "object" },
    });
}
