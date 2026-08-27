import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BoneNotAllowedReportsUnknownBoneCase } from "../Types/BoneNotAllowedReportsUnknownBoneTypes.js";
import BoneNotAllowed from "../../src/Checks/Emote/BoneNotAllowed.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class BoneNotAllowedReportsUnknownBone {
    static readonly ID = "EMOTE/204";
    static readonly CASES: readonly BoneNotAllowedReportsUnknownBoneCase[] = [
        { name: "default animation bones are all in the allowed bone set", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "tail bone is outside the allowed bone set",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: [0, 0, 0] }, tail: { rotation: [0, 0, 0] } } }),
            }),
            expectedIds: ["EMOTE/204"],
            expectedPaths: [PersonaFixture.animationPath()],
        },
    ];

    static run(entry: BoneNotAllowedReportsUnknownBoneCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new BoneNotAllowed(), entry.files, entry.contentType ?? "persona");
    }
}
