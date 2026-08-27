import type { Finding } from "../../src/Types/CheckTypes.js";
import type { RootMovementOverLimitReportsOutOfRangePositionCase } from "../Types/RootMovementOverLimitReportsOutOfRangePositionTypes.js";
import RootMovementOverLimit from "../../src/Checks/Emote/RootMovementOverLimit.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class RootMovementOverLimitReportsOutOfRangePosition {
    static readonly ID = "EMOTE/402";
    static readonly CASES: readonly RootMovementOverLimitReportsOutOfRangePositionCase[] = [
        { name: "root position staying at the origin is within limits", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "root Y position 20 is above the 16 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 20, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
        {
            name: "root Y position minus 1 is below the 0 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, -1, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
        {
            name: "root X position 5 is beyond the plus or minus 4 limit",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [5, 0, 0], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/402"],
        },
    ];

    static run(entry: RootMovementOverLimitReportsOutOfRangePositionCase): Promise<Finding[]> {
        return PersonaFixture.run(new RootMovementOverLimit(), entry.files, entry.contentType ?? "persona");
    }
}
