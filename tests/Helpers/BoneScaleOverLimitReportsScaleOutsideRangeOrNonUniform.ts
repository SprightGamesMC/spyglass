import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniformCase } from "../Types/BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniformTypes.js";
import BoneScaleOverLimit from "../../src/Checks/Emote/BoneScaleOverLimit.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform {
    static readonly ID = "EMOTE/403";
    static readonly CASES: readonly BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniformCase[] = [
        {
            name: "uniform scale 1.1 is inside 0.85 to 1.15",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { body: { scale: { "0.0": [1, 1, 1], "1.0": [1.1, 1.1, 1.1], "2.0": [1, 1, 1] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "uniform scale 1.2 is above 1.15",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { body: { scale: { "0.0": [1, 1, 1], "1.0": [1.2, 1.2, 1.2], "2.0": [1, 1, 1] } } },
                }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/403", 2),
        },
        {
            name: "scale 1 1.1 1 is not uniform",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { body: { scale: { "0.0": [1, 1, 1], "1.0": [1, 1.1, 1], "2.0": [1, 1, 1] } } },
                }),
            }),
            expectedIds: ["EMOTE/403"],
        },
        {
            name: "linear segment between scale 1.15 keyframes stays at the 1.15 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        body: { scale: { "0.0": [1, 1, 1], "1.0": [1.15, 1.15, 1.15], "2.0": [1.15, 1.15, 1.15], "3.0": [1, 1, 1] } },
                    },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "catmullrom segment between scale 1.15 keyframes has sampled scale above 1.15",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        body: {
                            scale: {
                                "0.0": [1, 1, 1],
                                "1.0": { post: [1.15, 1.15, 1.15], lerp_mode: "catmullrom" },
                                "2.0": { post: [1.15, 1.15, 1.15], lerp_mode: "catmullrom" },
                                "3.0": [1, 1, 1],
                            },
                        },
                    },
                }),
            }),
            expectedIds: ["EMOTE/403"],
        },
    ];

    static run(entry: BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniformCase): Promise<Finding[]> {
        return PersonaFixture.run(new BoneScaleOverLimit(), entry.files, entry.contentType ?? "persona");
    }
}
