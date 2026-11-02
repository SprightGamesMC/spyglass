import type { CheckContext } from "../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { EmoteAnimationFile, EmoteChannel, EmoteKeyframe, PersonaPackData } from "../Types/PersonaTypes.js";
import type Loaders from "./Loaders.js";
import JsonLoader from "./JsonLoader.js";
import PersonaLoader from "./PersonaLoader.js";

export default abstract class EmoteAnimationLoader {
    static readonly CHANNELS: readonly EmoteChannel[] = ["rotation", "position", "scale"];
    private static readonly VECTOR_LENGTH = 3;
    private static readonly NUMERIC_STRING_PATTERN = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/;
    private static readonly CACHE_KEY_PREFIX = "emote-animation:";

    static load(context: CheckContext, data: PersonaPackData): Promise<EmoteAnimationFile | undefined> {
        const path = EmoteAnimationLoader.animationPath(data);

        if (path === undefined) {
            return Promise.resolve(undefined);
        }

        return context.loaders.cached(EmoteAnimationLoader.CACHE_KEY_PREFIX + path, () =>
            EmoteAnimationLoader.collect(context.loaders, path)
        );
    }

    static animationPath(data: PersonaPackData): string | undefined {
        const fileName = EmoteAnimationLoader.animationFileName(data);

        if (fileName === undefined) {
            return undefined;
        }

        return PersonaLoader.findItem(data.pack, fileName)?.path;
    }

    static animationFileName(data: PersonaPackData): string | undefined {
        const source = PersonaLoader.animationSource(data.meta);

        return source === undefined ? undefined : PersonaLoader.string(source.entry, "animationFile");
    }

    static bones(animation: JsonObject): Map<string, JsonObject> {
        const bones = new Map<string, JsonObject>();
        const value = JsonLoader.get(animation, "bones");

        if (!JsonLoader.isObject(value)) {
            return bones;
        }

        for (const [name, bone] of Object.entries(value)) {
            if (JsonLoader.isObject(bone)) {
                bones.set(name, bone);
            }
        }

        return bones;
    }

    static keyframes(bone: JsonObject, channel: EmoteChannel): EmoteKeyframe[] {
        const value = bone[channel];

        if (!JsonLoader.isObject(value)) {
            return EmoteAnimationLoader.isVectorForm(value) ? [EmoteAnimationLoader.keyframe(0, value)] : [];
        }

        const keyframes: EmoteKeyframe[] = [];

        for (const [key, entry] of Object.entries(value)) {
            const time = Number(key);

            if (Number.isNaN(time)) {
                continue;
            }

            keyframes.push(EmoteAnimationLoader.keyframe(time, entry));
        }

        return keyframes.sort((left, right) => left.time - right.time);
    }

    static isKeyframed(bone: JsonObject, channel: EmoteChannel): boolean {
        return JsonLoader.isObject(bone[channel]);
    }

    static animationEnd(animation: JsonObject): number | undefined {
        const declared = animation.animation_length;
        const last = EmoteAnimationLoader.lastKeyframeTime(animation);

        if (typeof declared !== "number") {
            return last;
        }

        return last === undefined ? declared : Math.max(declared, last);
    }

    static lastKeyframeTime(animation: JsonObject): number | undefined {
        let last: number | undefined;

        for (const bone of EmoteAnimationLoader.bones(animation).values()) {
            for (const channel of EmoteAnimationLoader.CHANNELS) {
                for (const keyframe of EmoteAnimationLoader.keyframes(bone, channel)) {
                    last = last === undefined ? keyframe.time : Math.max(last, keyframe.time);
                }
            }
        }

        return last;
    }

    static startValue(keyframes: readonly EmoteKeyframe[]): readonly number[] | undefined {
        return keyframes[0] === undefined ? undefined : EmoteAnimationLoader.outgoingValue(keyframes[0]);
    }

    static endValue(keyframes: readonly EmoteKeyframe[]): readonly number[] | undefined {
        const last = keyframes[keyframes.length - 1];

        return last === undefined ? undefined : EmoteAnimationLoader.incomingValue(last);
    }

    static outgoingValue(keyframe: EmoteKeyframe): readonly number[] | undefined {
        return keyframe.hasNonNumericValue ? undefined : (keyframe.post ?? keyframe.pre);
    }

    static incomingValue(keyframe: EmoteKeyframe): readonly number[] | undefined {
        return keyframe.hasNonNumericValue ? undefined : (keyframe.pre ?? keyframe.post);
    }

    static formatVector(vector: readonly number[]): string {
        return vector.join(" ");
    }

    static equals(left: readonly number[], right: readonly number[]): boolean {
        return left.length === right.length && left.every((component, index) => component === right[index]);
    }

    private static vector(value: JsonValue | undefined): number[] | undefined {
        if (typeof value === "number" || typeof value === "string") {
            const component = EmoteAnimationLoader.component(value);

            return component === undefined ? undefined : [component, component, component];
        }

        if (!JsonLoader.isArray(value) || value.length !== EmoteAnimationLoader.VECTOR_LENGTH) {
            return undefined;
        }

        const components = value.map((component) => EmoteAnimationLoader.component(component));

        return components.every((component) => component !== undefined) ? (components as number[]) : undefined;
    }

    private static component(value: JsonValue): number | undefined {
        if (typeof value === "number") {
            return value;
        }

        if (typeof value !== "string" || !EmoteAnimationLoader.NUMERIC_STRING_PATTERN.test(value)) {
            return undefined;
        }

        const parsed = Number(value);

        return Number.isFinite(parsed) ? parsed : undefined;
    }

    private static isVectorForm(value: JsonValue | undefined): boolean {
        if (typeof value === "number" || typeof value === "string") {
            return true;
        }

        return JsonLoader.isArray(value) && value.length === EmoteAnimationLoader.VECTOR_LENGTH;
    }

    private static isNonNumeric(value: JsonValue | undefined): boolean {
        return EmoteAnimationLoader.isVectorForm(value) && EmoteAnimationLoader.vector(value) === undefined;
    }

    private static keyframe(time: number, entry: JsonValue): EmoteKeyframe {
        if (!JsonLoader.isObject(entry)) {
            const value = EmoteAnimationLoader.vector(entry);

            return { time, pre: value, post: value, hasNonNumericValue: EmoteAnimationLoader.isNonNumeric(entry) };
        }

        const pre = JsonLoader.get(entry, "pre");
        const post = JsonLoader.get(entry, "post");

        return {
            time,
            pre: EmoteAnimationLoader.vector(pre),
            post: EmoteAnimationLoader.vector(post),
            lerpMode: PersonaLoader.string(entry, "lerp_mode"),
            hasNonNumericValue: EmoteAnimationLoader.isNonNumeric(pre) || EmoteAnimationLoader.isNonNumeric(post),
        };
    }

    private static async collect(loaders: Loaders, path: string): Promise<EmoteAnimationFile | undefined> {
        const root = await loaders.json.readObject(path);

        if (root === undefined) {
            return undefined;
        }

        const animations = new Map<string, JsonObject>();
        const declared = JsonLoader.get(root, "animations");

        if (JsonLoader.isObject(declared)) {
            for (const [name, animation] of Object.entries(declared)) {
                if (JsonLoader.isObject(animation)) {
                    animations.set(name, animation);
                }
            }
        }

        return { path, root, animations };
    }
}
