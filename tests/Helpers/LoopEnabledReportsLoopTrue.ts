import type { Finding } from "../../src/Types/CheckTypes.js";
import type { LoopEnabledReportsLoopTrueCase } from "../Types/LoopEnabledReportsLoopTrueTypes.js";
import LoopEnabled from "../../src/Checks/Emote/LoopEnabled.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class LoopEnabledReportsLoopTrue {
    static readonly ID = "EMOTE/701";
    static readonly CASES: readonly LoopEnabledReportsLoopTrueCase[] = [
        { name: "animation without a loop key does not loop", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "animation with loop false does not loop",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ loop: false }) }),
            expectedIds: [],
        },
        {
            name: "animation with loop true loops",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ loop: true }) }),
            expectedIds: ["EMOTE/701"],
        },
    ];

    static run(entry: LoopEnabledReportsLoopTrueCase): Promise<Finding[]> {
        return PersonaFixture.run(new LoopEnabled(), entry.files, entry.contentType ?? "persona");
    }
}
