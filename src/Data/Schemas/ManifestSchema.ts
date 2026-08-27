import type { Schema } from "../../Types/SchemaTypes.js";

export default abstract class ManifestSchema {
    static readonly VERSION: Schema = { type: ["string", "array"] };
    static readonly HEADER: Schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            uuid: { type: "string" },
            version: ManifestSchema.VERSION,
            description: { type: "string" },
            base_game_version: ManifestSchema.VERSION,
            lock_template_options: { type: "boolean" },
            allow_random_seed: { type: "boolean" },
            min_engine_version: ManifestSchema.VERSION,
            max_engine_version: ManifestSchema.VERSION,
            platform_locked: { type: "boolean" },
            pack_scope: { type: "string" },
        },
    };
    static readonly MODULES: Schema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                type: { type: "string" },
                uuid: { type: "string" },
                version: ManifestSchema.VERSION,
                description: { type: "string" },
                language: { type: "string" },
                entry: { type: "string" },
            },
        },
    };
    static readonly DEPENDENCIES: Schema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                uuid: { type: "string" },
                module_name: { type: "string" },
                version: ManifestSchema.VERSION,
            },
        },
    };
    static readonly SUBPACKS: Schema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                folder_name: { type: "string" },
                name: { type: "string" },
                memory_tier: { type: "number" },
                memory_performance_tier: { type: "number" },
            },
        },
    };
    static readonly SETTINGS: Schema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                type: { type: "string" },
                text: { type: "string" },
                name: { type: "string" },
                default: { type: ["boolean", "number", "string"] },
                min: { type: "number" },
                max: { type: "number" },
                step: { type: "number" },
                options: {
                    type: "array",
                    items: { type: "object", properties: { name: { type: "string" }, text: { type: "string" } } },
                },
            },
        },
    };
    static readonly SCHEMA: Schema = {
        type: "object",
        required: ["header", "modules"],
        additionalProperties: false,
        properties: {
            format_version: { type: "number" },
            header: ManifestSchema.HEADER,
            modules: ManifestSchema.MODULES,
            dependencies: ManifestSchema.DEPENDENCIES,
            subpacks: ManifestSchema.SUBPACKS,
            capabilities: { type: "array", items: { type: "string" } },
            metadata: { type: "object" },
            settings: ManifestSchema.SETTINGS,
        },
    };
}
