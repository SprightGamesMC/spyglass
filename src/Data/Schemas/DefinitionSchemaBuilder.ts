import type { Schema } from "../../Types/SchemaTypes.js";
import JsonKeys from "../JsonKeys.js";

export default abstract class DefinitionSchemaBuilder {
    private static readonly FORMAT_VERSION: Schema = { type: "string" };
    private static readonly DESCRIPTION: Schema = {
        type: "object",
        required: ["identifier"],
        properties: { identifier: { type: "string" } },
    };

    static build(
        rootKey: string,
        rootProperties: Readonly<Record<string, Schema>>,
        description = DefinitionSchemaBuilder.DESCRIPTION
    ): Schema {
        return {
            type: "object",
            required: [JsonKeys.FORMAT_VERSION, rootKey],
            additionalProperties: false,
            properties: {
                format_version: DefinitionSchemaBuilder.FORMAT_VERSION,
                [rootKey]: {
                    type: "object",
                    required: ["description"],
                    properties: { description, ...rootProperties },
                },
            },
        };
    }

    static buildAny(rootKeys: readonly string[], rootProperties: Readonly<Record<string, Schema>>): Schema {
        return {
            definitionTypes: Object.fromEntries(
                rootKeys.map((rootKey) => [rootKey, DefinitionSchemaBuilder.build(rootKey, rootProperties)])
            ),
        };
    }
}
