import type { Finding } from "../../src/Types/CheckTypes.js";
import type { EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframeCase } from "../Types/EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframeTypes.js";
import EdgeKeyframeMissing from "../../src/Checks/Emote/EdgeKeyframeMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe {
    static readonly ID = "EMOTE/105";
    static readonly CASES: readonly EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframeCase[] = [
        {
            name: "channel with keyframes at time 0 and at animation_length has both edges",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "channel with one vector has no keyframes to test",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: [0, 0, 0] } } }) }),
            expectedIds: [],
        },
        {
            name: "first keyframe at 0.5 seconds leaves time 0 without a keyframe",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.5": [0, 0, 0], "2.0": [0, 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/105"],
        },
        {
            name: "last keyframe at 1 second leaves animation_length 2 without a keyframe",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": [0, 0, 0], "1.0": [0, 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/105"],
        },
        {
            name: "head rotation ending at 2 seconds has no keyframe at the 3 second end set by body rotation",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        head: { rotation: { "0.0": [0, 0, 0], "2.0": [0, 0, 0] } },
                        body: { rotation: { "0.0": [0, 0, 0], "3.0": [0, 0, 0] } },
                    },
                }),
            }),
            expectedIds: ["EMOTE/105"],
        },
        {
            name: "single keyframe at 1 second has neither edge",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "1.0": [0, 0, 0] } } } }),
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/105", 2),
        },
    ];

    static run(entry: EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframeCase): Promise<Finding[]> {
        return PersonaFixture.run(new EdgeKeyframeMissing(), entry.files, entry.contentType ?? "persona");
    }
}
