import type { Finding } from "../../src/Types/CheckTypes.js";
import type { KeyframeNotOnFrameReportsTimeOffFrameCase } from "../Types/KeyframeNotOnFrameReportsTimeOffFrameTypes.js";
import KeyframeNotOnFrame from "../../src/Checks/Emote/KeyframeNotOnFrame.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class KeyframeNotOnFrameReportsTimeOffFrame {
    static readonly ID = "EMOTE/214";
    static readonly CASES: readonly KeyframeNotOnFrameReportsTimeOffFrameCase[] = [
        {
            name: "keyframe at 0.0417 is within 0.0005 seconds of frame 1",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { head: { rotation: { "0.0": [0, 0, 0], "0.0417": [0, 0, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "keyframe at 0.5 is frame 12",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { head: { rotation: { "0.0": [0, 0, 0], "0.5": [0, 0, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "keyframe at 0.04 is more than 0.0005 seconds from frame 1",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { head: { rotation: { "0.0": [0, 0, 0], "0.04": [0, 0, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/214"],
        },
    ];

    static run(entry: KeyframeNotOnFrameReportsTimeOffFrameCase): Promise<Finding[]> {
        return PersonaFixture.run(new KeyframeNotOnFrame(), entry.files, entry.contentType ?? "persona");
    }
}
