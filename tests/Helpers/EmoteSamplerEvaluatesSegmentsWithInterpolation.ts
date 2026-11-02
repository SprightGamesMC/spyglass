import type { EmoteSamplerEvaluatesSegmentsWithInterpolationCase } from "../Types/EmoteSamplerEvaluatesSegmentsWithInterpolationTypes.js";
import EmoteSampler from "../../src/Checks/Emote/EmoteSampler.js";
import EmoteAnimationLoader from "../../src/Loaders/EmoteAnimationLoader.js";

export default abstract class EmoteSamplerEvaluatesSegmentsWithInterpolation {
    static readonly CASES: readonly EmoteSamplerEvaluatesSegmentsWithInterpolationCase[] = [
        {
            name: "linear segment from Y 0 to Y 24 is 12 at the middle",
            channel: { "0.0": [0, 0, 0], "1.0": [0, 24, 0] },
            time: 0.5,
            expectedY: 12,
        },
        {
            name: "linear segment runs from the post value of the first keyframe to the pre value of the second",
            channel: { "0.0": { pre: [0, 100, 0], post: [0, 0, 0] }, "1.0": { pre: [0, 24, 0], post: [0, 100, 0] } },
            time: 0.5,
            expectedY: 12,
        },
        {
            name: "catmullrom segment between Y 16 keyframes with Y 0 neighbors is 18 at the middle",
            channel: {
                "0.0": [0, 0, 0],
                "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                "2.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                "3.0": [0, 0, 0],
            },
            time: 1.5,
            expectedY: 18,
        },
        {
            name: "segment with catmullrom on only the first keyframe is catmullrom",
            channel: { "0.0": [0, 0, 0], "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" }, "2.0": [0, 16, 0], "3.0": [0, 0, 0] },
            time: 1.5,
            expectedY: 18,
        },
        {
            name: "segment with catmullrom on only the second keyframe is catmullrom",
            channel: { "0.0": [0, 0, 0], "1.0": [0, 16, 0], "2.0": { post: [0, 16, 0], lerp_mode: "catmullrom" }, "3.0": [0, 0, 0] },
            time: 1.5,
            expectedY: 18,
        },
        {
            name: "first catmullrom segment repeats the first keyframe as the outer control point",
            channel: { "0.0": { post: [0, 0, 0], lerp_mode: "catmullrom" }, "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" } },
            time: 0.5,
            expectedY: 8,
        },
    ];

    static sampleY(entry: EmoteSamplerEvaluatesSegmentsWithInterpolationCase): number | undefined {
        const keyframes = EmoteAnimationLoader.keyframes({ position: entry.channel } as never, "position");
        const sample = EmoteSampler.groups(keyframes)
            .flat()
            .find((candidate) => candidate.time === entry.time);

        return sample?.value[1];
    }

    static times(): readonly number[] {
        const keyframes = EmoteAnimationLoader.keyframes({ position: { "0.01": [0, 0, 0], "0.1": [0, 0, 0] } } as never, "position");

        return EmoteSampler.groups(keyframes)
            .flat()
            .map((sample) => sample.time);
    }
}
