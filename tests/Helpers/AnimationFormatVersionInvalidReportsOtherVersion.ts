import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { AnimationFormatVersionInvalidReportsOtherVersionCase } from "../Types/AnimationFormatVersionInvalidReportsOtherVersionTypes.js";
import AnimationFormatVersionInvalid from "../../src/Checks/Emote/AnimationFormatVersionInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationFormatVersionInvalidReportsOtherVersion {
    static readonly ID = "EMOTE/501";
    static readonly CASES: readonly AnimationFormatVersionInvalidReportsOtherVersionCase[] = [
        { name: "format_version 1.8.0 is the required emote animation version", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "format_version 1.10.0 is not the required 1.8.0",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ formatVersion: "1.10.0" }) }),
            expectedIds: ["EMOTE/501"],
            expectedPaths: [PersonaFixture.animationPath()],
        },
    ];

    static run(entry: AnimationFormatVersionInvalidReportsOtherVersionCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new AnimationFormatVersionInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
