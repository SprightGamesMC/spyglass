import type { Finding } from "../../src/Types/CheckTypes.js";
import type { RootMovementOverLimitReportsOutOfRangePositionCase } from "../Types/RootMovementOverLimitReportsOutOfRangePositionTypes.js";
import RootMovementOverLimit from "../../src/Checks/Emote/RootMovementOverLimit.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class RootMovementOverLimitReportsOutOfRangePosition {
    static readonly ID = "EMOTE/402";
    static readonly CASES: readonly RootMovementOverLimitReportsOutOfRangePositionCase[] = [
        { name: "root position staying at the origin is within limits", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "root Y position 20 is above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 20, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/402", 2),
            expectedFields: [
                "animations.animation.em_spright_wave.bones.root.position.0.833333",
                "animations.animation.em_spright_wave.bones.root.position.1",
            ],
        },
        {
            name: "root Y position minus 1 is below the 0 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, -1, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/402", 2),
        },
        {
            name: "root X position 5 is beyond the plus or minus 4 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [5, 0, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/402", 2),
        },
        {
            name: "linear segment between root Y 16 keyframes stays at the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 16, 0], "2.0": [0, 16, 0], "3.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "catmullrom on both ends of a segment between root Y 16 keyframes goes above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        root: {
                            position: {
                                "0.0": [0, 0, 0],
                                "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "2.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "3.0": [0, 0, 0],
                            },
                        },
                    },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
        {
            name: "catmullrom on only the first keyframe of a segment evaluates the segment as catmullrom and goes above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        root: {
                            position: {
                                "0.0": [0, 0, 0],
                                "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "2.0": [0, 16, 0],
                                "3.0": [0, 0, 0],
                            },
                        },
                    },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
        {
            name: "catmullrom on only the second keyframe of a segment evaluates the segment as catmullrom and goes above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        root: {
                            position: {
                                "0.0": [0, 0, 0],
                                "1.0": [0, 16, 0],
                                "2.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "3.0": [0, 0, 0],
                            },
                        },
                    },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
        {
            name: "sampled root Y 16.0005 between keyframes is inside the 0.001 tolerance",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        root: {
                            position: {
                                "0.0": [0, 15.996, 0],
                                "1.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "2.0": { post: [0, 16, 0], lerp_mode: "catmullrom" },
                                "3.0": [0, 15.996, 0],
                            },
                        },
                    },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "keyframe root Y 16.0005 is above the 16 limit because keyframe values have no tolerance",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 16.0005, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/402"],
            expectedFields: ["animations.animation.em_spright_wave.bones.root.position.1"],
        },
        {
            name: "numeric string root Y 20 is read as a number above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, "20", 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/402", 2),
        },
        {
            name: "pre value root Y 20 on the first keyframe is above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": { pre: [0, 20, 0], post: [0, 0, 0] }, "1.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
    ];

    static run(entry: RootMovementOverLimitReportsOutOfRangePositionCase): Promise<Finding[]> {
        return PersonaFixture.run(new RootMovementOverLimit(), entry.files, entry.contentType ?? "persona");
    }
}
