import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { FileEntry, Storage } from "../Types/StorageTypes.js";
import UsageError from "../Errors/UsageError.js";
import JsonLoader from "../Loaders/JsonLoader.js";
import PersonaFormat from "../Loaders/PersonaFormat.js";
import PathUtilities from "./PathUtilities.js";

export default class EmoteProjectStorage implements Storage {
    private static readonly PROJECT_EXTENSION = "bbmodel";
    private static readonly EMOTE_MODEL_FORMAT = "bedrock_emote";
    private static readonly IDENTIFIER_PREFIX = "em_";
    private static readonly DEFAULT_IDENTIFIER = "unknown";
    private static readonly DEFAULT_PACK_UUID = "00000000-0000-4000-8000-000000000000";
    private static readonly ANIMATION_FORMAT_VERSION = "1.8.0";
    private static readonly CATMULLROM_INTERPOLATION = "catmullrom";
    private static readonly STEP_INTERPOLATION = "step";
    private static readonly CHANNELS: readonly string[] = ["rotation", "position", "scale"];
    private static readonly AXES: readonly string[] = ["x", "y", "z"];
    private static readonly LOOP_VALUES: Readonly<Record<string, JsonValue>> = { loop: true, hold: "hold_on_last_frame" };
    private static readonly LANG_FIELDS: Readonly<Record<string, string>> = {
        "persona.offer.title": "persona_emote_display_name",
        "persona.emote.chat_message": "persona_emote_chat_message",
        "persona.emote.easter_egg": "persona_emote_chat_easter_egg",
    };

    private readonly files: ReadonlyMap<string, Uint8Array>;
    private readonly entries: readonly FileEntry[];

    static isProjectPath(path: string): boolean {
        return PathUtilities.extension(path) === EmoteProjectStorage.PROJECT_EXTENSION;
    }

    private static parse(text: string, name: string): JsonObject {
        const problem = "Input " + name + " is not a Persona Emote project";
        let project: JsonValue;

        try {
            project = JSON.parse(text) as JsonValue;
        } catch (error) {
            throw new UsageError(problem + ": " + (error as Error).message);
        }

        if (
            !JsonLoader.isObject(project) ||
            JsonLoader.get(JsonLoader.get(project, "meta"), "model_format") !== EmoteProjectStorage.EMOTE_MODEL_FORMAT
        ) {
            throw new UsageError(problem);
        }

        return project;
    }

    private static identifier(project: JsonObject): string {
        const value = project.model_identifier;
        const name = typeof value === "string" && value !== "" ? value : EmoteProjectStorage.DEFAULT_IDENTIFIER;

        return name.startsWith(EmoteProjectStorage.IDENTIFIER_PREFIX) ? name : EmoteProjectStorage.IDENTIFIER_PREFIX + name;
    }

    private static firstAnimation(project: JsonObject): JsonObject | undefined {
        const animations = project.animations;
        const first = JsonLoader.isArray(animations) ? animations[0] : undefined;

        return JsonLoader.isObject(first) ? first : undefined;
    }

    private static manifest(project: JsonObject): JsonObject {
        const uuid = project.persona_emote_pack_uuid;

        return {
            format_version: 1,
            header: {
                description: "pack.description",
                name: "pack.name",
                uuid: typeof uuid === "string" ? uuid : EmoteProjectStorage.DEFAULT_PACK_UUID,
                version: [1, 0, 0],
            },
            modules: [{ type: "persona_piece", uuid: EmoteProjectStorage.DEFAULT_PACK_UUID, version: [1, 0, 0] }],
        };
    }

    private static meta(identifier: string, hasAnimation: boolean): JsonObject {
        const meta: JsonObject = {
            piece_id: EmoteProjectStorage.DEFAULT_PACK_UUID,
            piece_name: identifier,
            piece_type: PersonaFormat.EMOTE_TYPE,
        };

        if (hasAnimation) {
            meta[PersonaFormat.ANIMATION_SOURCES_KEY] = [
                { name: "animation." + identifier, animationFile: identifier + PersonaFormat.ANIMATION_SUFFIX },
            ];
        }

        return meta;
    }

    private static lang(project: JsonObject): string {
        const lines: string[] = [];

        for (const [key, field] of Object.entries(EmoteProjectStorage.LANG_FIELDS)) {
            const value = project[field];

            if (typeof value === "string" && value !== "") {
                lines.push(key + "=" + value);
            }
        }

        return lines.join("\n") + "\n";
    }

    private static animationFile(identifier: string, animation: JsonObject | undefined): JsonObject {
        const animations: JsonObject = {};

        if (animation !== undefined) {
            animations["animation." + identifier] = EmoteProjectStorage.compiledAnimation(animation);
        }

        return { format_version: EmoteProjectStorage.ANIMATION_FORMAT_VERSION, animations };
    }

    private static compiledAnimation(animation: JsonObject): JsonObject {
        const compiled: JsonObject = {};
        const loop = typeof animation.loop === "string" ? EmoteProjectStorage.LOOP_VALUES[animation.loop] : undefined;

        if (loop !== undefined) {
            compiled.loop = loop;
        }

        if (typeof animation.length === "number") {
            compiled.animation_length = animation.length;
        }

        compiled.bones = EmoteProjectStorage.compiledBones(animation.animators);

        return compiled;
    }

    private static compiledBones(animators: JsonValue | undefined): JsonObject {
        const bones: JsonObject = {};

        if (!JsonLoader.isObject(animators)) {
            return bones;
        }

        for (const animator of Object.values(animators)) {
            const name = JsonLoader.get(animator, "name");
            const keyframes = JsonLoader.get(animator, "keyframes");

            if (typeof name !== "string" || JsonLoader.get(animator, "type") !== "bone" || !JsonLoader.isArray(keyframes)) {
                continue;
            }

            bones[name] = EmoteProjectStorage.compiledBone(keyframes);
        }

        return bones;
    }

    private static compiledBone(keyframes: readonly JsonValue[]): JsonObject {
        const bone: JsonObject = {};
        const objects = keyframes.filter(
            (keyframe): keyframe is JsonObject => JsonLoader.isObject(keyframe) && typeof keyframe.time === "number"
        );

        for (const channel of EmoteProjectStorage.CHANNELS) {
            const sorted = objects
                .filter((keyframe) => keyframe.channel === channel)
                .sort((left, right) => Number(left.time) - Number(right.time));

            if (sorted.length === 0) {
                continue;
            }

            const compiled: JsonObject = {};

            sorted.forEach((keyframe, index) => {
                compiled[String(keyframe.time)] = EmoteProjectStorage.compiledKeyframe(keyframe, sorted[index - 1]);
            });
            bone[channel] = compiled;
        }

        return bone;
    }

    private static compiledKeyframe(keyframe: JsonObject, previous: JsonObject | undefined): JsonValue {
        const points = EmoteProjectStorage.points(keyframe);
        const last = points[points.length - 1];
        const isCatmullrom = keyframe.interpolation === EmoteProjectStorage.CATMULLROM_INTERPOLATION;
        const lerpMode: JsonObject = isCatmullrom ? { lerp_mode: EmoteProjectStorage.CATMULLROM_INTERPOLATION } : {};

        if (points.length > 1) {
            return { pre: points[0], post: last, ...lerpMode };
        }

        if (previous !== undefined && previous.interpolation === EmoteProjectStorage.STEP_INTERPOLATION) {
            const previousPoints = EmoteProjectStorage.points(previous);

            return { pre: previousPoints[previousPoints.length - 1], post: last, ...lerpMode };
        }

        return isCatmullrom ? { post: last, ...lerpMode } : last;
    }

    private static points(keyframe: JsonObject): JsonValue[][] {
        const points = keyframe.data_points;

        if (!JsonLoader.isArray(points) || points.length === 0) {
            return [EmoteProjectStorage.vector(undefined)];
        }

        return points.map((point) => EmoteProjectStorage.vector(point));
    }

    private static vector(point: JsonValue | undefined): JsonValue[] {
        return EmoteProjectStorage.AXES.map((axis) => {
            const value = JsonLoader.get(point, axis);

            return value === undefined || value === null || value === "" ? 0 : value;
        });
    }

    private static encoded(value: JsonObject | string): Uint8Array {
        return new TextEncoder().encode(typeof value === "string" ? value : JSON.stringify(value));
    }

    constructor(text: string, name: string) {
        const project = EmoteProjectStorage.parse(text, name);
        const identifier = EmoteProjectStorage.identifier(project);
        const animation = EmoteProjectStorage.firstAnimation(project);

        this.files = new Map<string, Uint8Array>([
            ["manifest.json", EmoteProjectStorage.encoded(EmoteProjectStorage.manifest(project))],
            [
                identifier + PersonaFormat.META_SUFFIX,
                EmoteProjectStorage.encoded(EmoteProjectStorage.meta(identifier, animation !== undefined)),
            ],
            [
                identifier + PersonaFormat.ANIMATION_SUFFIX,
                EmoteProjectStorage.encoded(EmoteProjectStorage.animationFile(identifier, animation)),
            ],
            [PersonaFormat.LANG_PATH, EmoteProjectStorage.encoded(EmoteProjectStorage.lang(project))],
        ]);
        this.entries = [...this.files].map(([path, bytes]) => ({ path, size: bytes.length }));
    }

    listFiles(): readonly FileEntry[] {
        return this.entries;
    }

    readBytes(path: string): Promise<Uint8Array> {
        const bytes = this.files.get(path);

        return bytes === undefined ? Promise.reject(new Error("File is not in the project: " + path)) : Promise.resolve(bytes);
    }
}
