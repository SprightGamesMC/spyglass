import type { Schema } from "../../Types/SchemaTypes.js";

export default abstract class PersonaMetaSchema {
    static readonly TINT_COLOR: Schema = {
        type: "object",
        properties: {
            r_color: { type: "string" },
            g_color: { type: "string" },
            b_color: { type: "string" },
            a_color: { type: "string" },
        },
        additionalProperties: false,
    };
    static readonly TEXTURE_SOURCE: Schema = {
        type: "object",
        properties: {
            texture: { type: "string" },
            tint_map: { type: "string" },
            use_face_uv: { type: "boolean" },
            animated: { type: "boolean" },
            frames: { type: "integer" },
        },
        additionalProperties: false,
    };
    static readonly GEOMETRY_SOURCE: Schema = {
        type: "object",
        properties: {
            geometry: { type: "string" },
            body_size: { type: "string" },
            arm_size: { type: "string" },
            side: { type: "string" },
            zone: { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] },
            texture: { type: "string" },
            tint_map: { type: "string" },
            animated: { type: "boolean" },
            frames: { type: "integer" },
        },
        additionalProperties: false,
    };
    static readonly ANIMATION_SOURCE: Schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            animationFile: { type: "string" },
        },
        additionalProperties: false,
    };
    static readonly SCHEMA: Schema = {
        type: "object",
        properties: {
            piece_id: { type: "string" },
            piece_name: { type: "string" },
            piece_type: { type: "string" },
            zone: { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] },
            tint_base_color: PersonaMetaSchema.TINT_COLOR,
            tint_color: PersonaMetaSchema.TINT_COLOR,
            allow_tint_override: { type: "boolean" },
            texture_sources: { type: "array", items: PersonaMetaSchema.TEXTURE_SOURCE },
            geometry_sources: { type: "array", items: PersonaMetaSchema.GEOMETRY_SOURCE },
            animation_sources: { type: "array", items: PersonaMetaSchema.ANIMATION_SOURCE },
        },
        additionalProperties: false,
    };
}
