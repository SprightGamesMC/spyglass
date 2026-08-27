import type { CheckContext } from "../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { EmoteAnimationFile, EmoteChannel, EmoteKeyframe, PersonaPackData } from "../Types/PersonaTypes.js";
import type Loaders from "./Loaders.js";
import JsonLoader from "./JsonLoader.js";
import PersonaLoader from "./PersonaLoader.js";

export default abstract class EmoteAnimationLoader {
    static readonly CHANNELS: readonly EmoteChannel[] = ["rotation", "position", "scale"];
    private static readonly VECTOR_LENGTH = 3;
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
        const constant = EmoteAnimationLoader.vector(value);

        if (constant !== undefined) {
            return [{ time: 0, pre: constant, post: constant }];
        }

        if (!JsonLoader.isObject(value)) {
            return [];
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

    static length(animation: JsonObject): number | undefined {
        const declared = animation.animation_length;

        if (typeof declared === "number") {
            return declared;
        }

        return EmoteAnimationLoader.lastKeyframeTime(animation);
    }

    static startValue(keyframes: readonly EmoteKeyframe[]): readonly number[] | undefined {
        const first = keyframes[0];

        return first === undefined ? undefined : (first.post ?? first.pre);
    }

    static endValue(keyframes: readonly EmoteKeyframe[]): readonly number[] | undefined {
        const last = keyframes[keyframes.length - 1];

        return last === undefined ? undefined : (last.pre ?? last.post);
    }

    static formatVector(vector: readonly number[]): string {
        return vector.join(" ");
    }

    static equals(left: readonly number[], right: readonly number[]): boolean {
        return left.length === right.length && left.every((component, index) => component === right[index]);
    }

    private static vector(value: JsonValue | undefined): number[] | undefined {
        if (typeof value === "number") {
            return [value, value, value];
        }

        if (!JsonLoader.isArray(value) || value.length !== EmoteAnimationLoader.VECTOR_LENGTH) {
            return undefined;
        }

        if (!value.every((component) => typeof component === "number")) {
            return undefined;
        }

        return value as number[];
    }

    private static lastKeyframeTime(animation: JsonObject): number | undefined {
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

    private static keyframe(time: number, entry: JsonValue): EmoteKeyframe {
        const constant = EmoteAnimationLoader.vector(entry);

        if (constant !== undefined) {
            return { time, pre: constant, post: constant };
        }

        return {
            time,
            pre: EmoteAnimationLoader.vector(JsonLoader.get(entry, "pre")),
            post: EmoteAnimationLoader.vector(JsonLoader.get(entry, "post")),
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
