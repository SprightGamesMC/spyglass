import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationTimeQueryUsedReportsQueryUseCase } from "../Types/AnimationTimeQueryUsedReportsQueryUseTypes.js";
import AnimationTimeQueryUsed from "../../src/Checks/Emote/AnimationTimeQueryUsed.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationTimeQueryUsedReportsQueryUse {
    static readonly ID = "EMOTE/206";
    static readonly CASES: readonly AnimationTimeQueryUsedReportsQueryUseCase[] = [
        {
            name: "animation without an anim_time query does not use the forbidden query",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "query.anim_time in a keyframe is a forbidden anim_time query",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": ["query.anim_time * 10", 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/206"],
        },
        {
            name: "q.anim_time in a keyframe is the short form of the forbidden anim_time query",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": ["q.anim_time * 10", 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/206"],
        },
    ];

    static run(entry: AnimationTimeQueryUsedReportsQueryUseCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationTimeQueryUsed(), entry.files, entry.contentType ?? "persona");
    }
}
