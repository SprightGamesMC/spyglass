import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationLengthNotOnFrameReportsLengthOffFrameCase } from "../Types/AnimationLengthNotOnFrameReportsLengthOffFrameTypes.js";
import AnimationLengthNotOnFrame from "../../src/Checks/Emote/AnimationLengthNotOnFrame.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationLengthNotOnFrameReportsLengthOffFrame {
    static readonly ID = "EMOTE/215";
    static readonly CASES: readonly AnimationLengthNotOnFrameReportsLengthOffFrameCase[] = [
        {
            name: "length of 3.75 is frame 90",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ length: 3.75 }) }),
            expectedIds: [],
        },
        {
            name: "length of 1.0417 is within 0.0005 seconds of frame 25",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ length: 1.0417 }) }),
            expectedIds: [],
        },
        {
            name: "animation without a length is not reported",
            files: PersonaFixture.emoteFiles({
                animation: {
                    format_version: "1.8.0",
                    animations: { [PersonaFixture.EMOTE_ANIMATION]: { bones: {} } },
                },
            }),
            expectedIds: [],
        },
        {
            name: "length of 2.04 is more than 0.0005 seconds from frame 49",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ length: 2.04 }) }),
            expectedIds: ["EMOTE/215"],
            expectedFields: ["animations." + PersonaFixture.EMOTE_ANIMATION + ".animation_length"],
        },
    ];

    static run(entry: AnimationLengthNotOnFrameReportsLengthOffFrameCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationLengthNotOnFrame(), entry.files, entry.contentType ?? "persona");
    }
}
