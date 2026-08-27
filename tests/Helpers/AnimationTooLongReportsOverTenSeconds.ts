import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationTooLongReportsOverTenSecondsCase } from "../Types/AnimationTooLongReportsOverTenSecondsTypes.js";
import AnimationTooLong from "../../src/Checks/Emote/AnimationTooLong.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationTooLongReportsOverTenSeconds {
    static readonly ID = "EMOTE/401";
    static readonly CASES: readonly AnimationTooLongReportsOverTenSecondsCase[] = [
        { name: "animation_length 2 is within the 10 second limit", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "animation_length 12 is above the 10 second limit",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ length: 12 }) }),
            expectedIds: ["EMOTE/401"],
        },
        {
            name: "last keyframe at 11 seconds without animation_length is above the 10 second limit",
            files: PersonaFixture.emoteFiles({
                animation: {
                    format_version: "1.8.0",
                    animations: {
                        [PersonaFixture.EMOTE_ANIMATION]: { bones: { head: { rotation: { "0.0": [0, 0, 0], "11.0": [0, 0, 0] } } } },
                    },
                },
            }),
            expectedIds: ["EMOTE/401"],
        },
    ];

    static run(entry: AnimationTooLongReportsOverTenSecondsCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationTooLong(), entry.files, entry.contentType ?? "persona");
    }
}
