import type { Schema } from "../../Types/SchemaTypes.js";
import JsonKeys from "../JsonKeys.js";

export default abstract class SoundDefinitionsSchema {
    static readonly SOUND_REFERENCE: Schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            volume: { type: "number" },
            pitch: { type: "number" },
            load_on_low_memory: { type: "boolean" },
            stream: { type: "boolean" },
            is3D: { type: "boolean" },
            weight: { type: "number" },
        },
        required: ["name"],
    };
    static readonly SOUND_DEFINITION: Schema = {
        type: "object",
        properties: {
            category: { type: "string" },
            sounds: { type: "array", items: { anyOf: [{ type: "string" }, SoundDefinitionsSchema.SOUND_REFERENCE] } },
            min_distance: { type: ["number", "null"] },
            max_distance: { type: ["number", "null"] },
            __use_legacy_max_distance: { anyOf: [{ type: "boolean" }, { type: "string", enum: ["true", "false"] }] },
        },
        required: ["sounds"],
    };
    static readonly FORMAT_VERSION_KEY = JsonKeys.FORMAT_VERSION;
    static readonly DEFINITIONS_KEY = "sound_definitions";
    static readonly WITH_FORMAT_VERSION: Schema = {
        type: "object",
        properties: {
            [SoundDefinitionsSchema.FORMAT_VERSION_KEY]: { type: "string" },
            [SoundDefinitionsSchema.DEFINITIONS_KEY]: { type: "object", additionalProperties: SoundDefinitionsSchema.SOUND_DEFINITION },
        },
        required: [SoundDefinitionsSchema.FORMAT_VERSION_KEY, SoundDefinitionsSchema.DEFINITIONS_KEY],
    };
    static readonly LEGACY: Schema = {
        type: "object",
        additionalProperties: SoundDefinitionsSchema.SOUND_DEFINITION,
    };
}
