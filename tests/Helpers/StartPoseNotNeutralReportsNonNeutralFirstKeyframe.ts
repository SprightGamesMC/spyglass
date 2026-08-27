import type { Finding } from "../../src/Types/CheckTypes.js";
import type { StartPoseNotNeutralReportsNonNeutralFirstKeyframeCase } from "../Types/StartPoseNotNeutralReportsNonNeutralFirstKeyframeTypes.js";
import StartPoseNotNeutral from "../../src/Checks/Emote/StartPoseNotNeutral.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class StartPoseNotNeutralReportsNonNeutralFirstKeyframe {
    static readonly ID = "EMOTE/207";
    static readonly CASES: readonly StartPoseNotNeutralReportsNonNeutralFirstKeyframeCase[] = [
        {
            name: "all bones at rotation 0 position 0 scale 1 on the first keyframe is a neutral start pose",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "rightArm rotation of 45 on the first keyframe is not a neutral start pose",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { rightArm: { rotation: { "0.0": [0, 0, 45], "2.0": [0, 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/207"],
        },
        {
            name: "root position of 4 on Y on the first keyframe is not a neutral start pose",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { root: { position: { "0.0": [0, 4, 0], "2.0": [0, 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/207"],
        },
        {
            name: "head position of 4 on Y on the first keyframe is allowed because only root position is checked",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { position: { "0.0": [0, 4, 0], "2.0": [0, 0, 0] } } } }),
            }),
            expectedIds: [],
        },
        {
            name: "body scale of 1.1 with no keyframes is a start pose away from scale 1",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ bones: { body: { scale: 1.1 } } }) }),
            expectedIds: ["EMOTE/207"],
        },
    ];

    static run(entry: StartPoseNotNeutralReportsNonNeutralFirstKeyframeCase): Promise<Finding[]> {
        return PersonaFixture.run(new StartPoseNotNeutral(), entry.files, entry.contentType ?? "persona");
    }
}
