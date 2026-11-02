import type { EmoteKeyframe, EmoteSample, EmoteSampleFailure, EmoteSampleInspector } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import EmoteLimits from "./EmoteLimits.js";

export default abstract class EmoteSampler {
    private static readonly MESSAGE_DECIMALS = 6;

    static isOnFrame(time: number): boolean {
        const nearestFrame = Math.round(time * EmoteLimits.FRAMES_PER_SECOND) / EmoteLimits.FRAMES_PER_SECOND;

        return Math.abs(time - nearestFrame) <= EmoteLimits.FRAME_TIME_TOLERANCE;
    }

    static groups(keyframes: readonly EmoteKeyframe[]): EmoteSample[][] {
        const first = keyframes[0];
        const last = keyframes[keyframes.length - 1];

        if (first === undefined) {
            return [];
        }

        const groups: EmoteSample[][] = [];

        if (EmoteSampler.hasSplitValues(first)) {
            groups.push([{ time: first.time, value: first.pre as readonly number[], isKeyframe: true }]);
        }

        for (let index = 0; index < keyframes.length - 1; index++) {
            groups.push(EmoteSampler.segment(keyframes, index));
        }

        const lastValue = EmoteAnimationLoader.outgoingValue(last);

        if (lastValue !== undefined && (keyframes.length === 1 || EmoteSampler.hasSplitValues(last))) {
            groups.push([{ time: last.time, value: lastValue, isKeyframe: true }]);
        }

        return groups;
    }

    static firstFailures(keyframes: readonly EmoteKeyframe[], inspect: EmoteSampleInspector): EmoteSampleFailure[] {
        const failures = new Map<number, EmoteSampleFailure>();

        for (const group of EmoteSampler.groups(keyframes)) {
            for (const sample of group) {
                const problem = inspect(sample);

                if (problem === undefined) {
                    continue;
                }

                if (!failures.has(sample.time)) {
                    failures.set(sample.time, { time: sample.time, problem });
                }

                break;
            }
        }

        return [...failures.values()];
    }

    static tolerance(sample: EmoteSample): number {
        return sample.isKeyframe ? 0 : EmoteLimits.SAMPLE_TOLERANCE;
    }

    static rounded(value: number): number {
        return Number(value.toFixed(EmoteSampler.MESSAGE_DECIMALS));
    }

    private static hasSplitValues(keyframe: EmoteKeyframe): boolean {
        return (
            !keyframe.hasNonNumericValue &&
            keyframe.pre !== undefined &&
            keyframe.post !== undefined &&
            !EmoteAnimationLoader.equals(keyframe.pre, keyframe.post)
        );
    }

    private static segment(keyframes: readonly EmoteKeyframe[], index: number): EmoteSample[] {
        const start = keyframes[index];
        const end = keyframes[index + 1];
        const from = EmoteAnimationLoader.outgoingValue(start);
        const to = EmoteAnimationLoader.incomingValue(end);
        const samples: EmoteSample[] = [];

        if (from !== undefined) {
            samples.push({ time: start.time, value: from, isKeyframe: true });
        }

        if (from !== undefined && to !== undefined) {
            samples.push(...EmoteSampler.interiorSamples(keyframes, index, from, to));
        }

        if (to !== undefined) {
            samples.push({ time: end.time, value: to, isKeyframe: true });
        }

        return samples;
    }

    private static interiorSamples(
        keyframes: readonly EmoteKeyframe[],
        index: number,
        from: readonly number[],
        to: readonly number[]
    ): EmoteSample[] {
        const start = keyframes[index];
        const end = keyframes[index + 1];
        const interpolate = EmoteSampler.interpolator(keyframes, index, from, to);

        if (interpolate === undefined) {
            return [];
        }

        const samples: EmoteSample[] = [];
        const lastTime = Math.min(end.time, EmoteLimits.MAX_SAMPLED_SECONDS);

        for (let frame = Math.ceil(start.time * EmoteLimits.FRAMES_PER_SECOND); frame / EmoteLimits.FRAMES_PER_SECOND < lastTime; frame++) {
            const time = frame / EmoteLimits.FRAMES_PER_SECOND;

            if (time > start.time) {
                samples.push({ time, value: interpolate((time - start.time) / (end.time - start.time)), isKeyframe: false });
            }
        }

        return samples;
    }

    private static interpolator(
        keyframes: readonly EmoteKeyframe[],
        index: number,
        from: readonly number[],
        to: readonly number[]
    ): ((alpha: number) => readonly number[]) | undefined {
        const start = keyframes[index];
        const end = keyframes[index + 1];
        const mode = EmoteLimits.CATMULLROM_LERP_MODE;

        if (start.lerpMode !== mode && end.lerpMode !== mode) {
            return (alpha) => from.map((value, axis) => value + (to[axis] - value) * alpha);
        }

        const before = EmoteSampler.outerBefore(keyframes, index, from);
        const after = EmoteSampler.outerAfter(keyframes, index, to);

        if (before === undefined || after === undefined) {
            return undefined;
        }

        return (alpha) => from.map((value, axis) => EmoteSampler.catmullrom(before[axis], value, to[axis], after[axis], alpha));
    }

    private static outerBefore(keyframes: readonly EmoteKeyframe[], index: number, from: readonly number[]): readonly number[] | undefined {
        const previous = keyframes[index - 1];

        if (previous === undefined || EmoteSampler.hasSplitValues(keyframes[index])) {
            return from;
        }

        return EmoteAnimationLoader.outgoingValue(previous);
    }

    private static outerAfter(keyframes: readonly EmoteKeyframe[], index: number, to: readonly number[]): readonly number[] | undefined {
        const next = keyframes[index + 2];

        if (next === undefined || EmoteSampler.hasSplitValues(keyframes[index + 1])) {
            return to;
        }

        return EmoteAnimationLoader.incomingValue(next);
    }

    private static catmullrom(before: number, from: number, to: number, after: number, alpha: number): number {
        const startSlope = (to - before) / 2;
        const endSlope = (after - from) / 2;

        return (
            (2 * from - 2 * to + startSlope + endSlope) * alpha ** 3 +
            (-3 * from + 3 * to - 2 * startSlope - endSlope) * alpha ** 2 +
            startSlope * alpha +
            from
        );
    }
}
