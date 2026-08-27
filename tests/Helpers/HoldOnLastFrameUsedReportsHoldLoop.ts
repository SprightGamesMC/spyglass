import type { Finding } from "../../src/Types/CheckTypes.js";
import type { HoldOnLastFrameUsedReportsHoldLoopCase } from "../Types/HoldOnLastFrameUsedReportsHoldLoopTypes.js";
import HoldOnLastFrameUsed from "../../src/Checks/Emote/HoldOnLastFrameUsed.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class HoldOnLastFrameUsedReportsHoldLoop {
    static readonly ID = "EMOTE/205";
    static readonly CASES: readonly HoldOnLastFrameUsedReportsHoldLoopCase[] = [
        { name: "animation without loop does not hold on the last frame", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "loop hold_on_last_frame is not allowed for an emote",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ loop: "hold_on_last_frame" }) }),
            expectedIds: ["EMOTE/205"],
        },
    ];

    static run(entry: HoldOnLastFrameUsedReportsHoldLoopCase): Promise<Finding[]> {
        return PersonaFixture.run(new HoldOnLastFrameUsed(), entry.files, entry.contentType ?? "persona");
    }
}
