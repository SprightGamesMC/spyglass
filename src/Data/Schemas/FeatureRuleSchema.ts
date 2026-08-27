import type { Schema } from "../../Types/SchemaTypes.js";
import DefinitionSchemaBuilder from "./DefinitionSchemaBuilder.js";

export default abstract class FeatureRuleSchema {
    static readonly ROOT_KEY = "minecraft:feature_rules";
    static readonly DESCRIPTION: Schema = {
        type: "object",
        required: ["identifier", "places_feature"],
        properties: { identifier: { type: "string" }, places_feature: { type: "string" } },
    };
    static readonly SCHEMA: Schema = DefinitionSchemaBuilder.build(
        FeatureRuleSchema.ROOT_KEY,
        {
            conditions: { type: "object" },
            distribution: { type: "object" },
        },
        FeatureRuleSchema.DESCRIPTION
    );
}
