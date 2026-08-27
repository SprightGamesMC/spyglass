import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { AnimationFileNotFoundReportsMissingFileCase } from "../Types/AnimationFileNotFoundReportsMissingFileTypes.js";
import AnimationFileNotFound from "../../src/Checks/Emote/AnimationFileNotFound.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationFileNotFoundReportsMissingFile {
    static readonly ID = "EMOTE/301";
    static readonly CASES: readonly AnimationFileNotFoundReportsMissingFileCase[] = [
        { name: "animationFile refers to a file that exists in the pack", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "animationFile refers to a file that is not in the pack",
            files: PersonaFixture.emoteFiles({ animation: null }),
            expectedIds: ["EMOTE/301"],
            expectedPaths: [PersonaFixture.metaPath(PersonaFixture.EMOTE_ID)],
        },
    ];

    static run(entry: AnimationFileNotFoundReportsMissingFileCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new AnimationFileNotFound(), entry.files, entry.contentType ?? "persona");
    }
}
