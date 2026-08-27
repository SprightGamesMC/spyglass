import type { Schema } from "../../Types/SchemaTypes.js";

export default abstract class SkinsSchema {
    static readonly SCHEMA: Schema = {
        type: "object",
        required: ["serialize_name", "localization_name", "skins"],
        properties: {
            serialize_name: { type: "string" },
            localization_name: { type: "string" },
            skins: {
                type: "array",
                items: {
                    type: "object",
                    required: ["localization_name", "geometry", "texture", "type"],
                    properties: {
                        localization_name: { type: "string" },
                        geometry: { type: "string" },
                        texture: { type: "string" },
                        type: { type: "string" },
                        cape: { type: "string" },
                    },
                },
            },
        },
    };
}
