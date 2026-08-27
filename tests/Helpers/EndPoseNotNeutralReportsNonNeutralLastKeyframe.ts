import type { Finding } from "../../src/Types/CheckTypes.js";
import type { EndPoseNotNeutralReportsNonNeutralLastKeyframeCase } from "../Types/EndPoseNotNeutralReportsNonNeutralLastKeyframeTypes.js";
import EndPoseNotNeutral from "../../src/Checks/Emote/EndPoseNotNeutral.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class EndPoseNotNeutralReportsNonNeutralLastKeyframe {
    static readonly ID = "EMOTE/208";
    static readonly CASES: readonly EndPoseNotNeutralReportsNonNeutralLastKeyframeCase[] = [
        { name: "last keyframe at rotation 0 0 0 ends in the neutral pose", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "last keyframe rotation 0 0 45 ends away from the neutral pose",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { rightArm: { rotation: { "0.0": [0, 0, 0], "2.0": [0, 0, 45] } } } }),
            }),
            expectedIds: ["EMOTE/208"],
        },
        {
            name: "last keyframe with neutral pre value ends in the neutral pose",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { rightArm: { rotation: { "0.0": [0, 0, 0], "2.0": { pre: [0, 0, 0], post: [0, 0, 45] } } } },
                }),
            }),
            expectedIds: [],
        },
    ];

    static run(entry: EndPoseNotNeutralReportsNonNeutralLastKeyframeCase): Promise<Finding[]> {
        return PersonaFixture.run(new EndPoseNotNeutral(), entry.files, entry.contentType ?? "persona");
    }
}
