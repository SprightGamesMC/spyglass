import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ScaledChildOfScaledParentReportsScaledDescendantCase } from "../Types/ScaledChildOfScaledParentReportsScaledDescendantTypes.js";
import ScaledChildOfScaledParent from "../../src/Checks/Emote/ScaledChildOfScaledParent.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ScaledChildOfScaledParentReportsScaledDescendant {
    static readonly ID = "EMOTE/702";
    static readonly CASES: readonly ScaledChildOfScaledParentReportsScaledDescendantCase[] = [
        {
            name: "scale on body with no scale on its descendants is allowed",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { body: { scale: { "0.0": [1, 1, 1], "1.0": [1.1, 1.1, 1.1], "2.0": [1, 1, 1] } }, head: { scale: [1, 1, 1] } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "scale on leftArm and rightArm is allowed because they are not ancestors of each other",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { leftArm: { scale: 1.1 }, rightArm: { scale: 1.1 } } }),
            }),
            expectedIds: [],
        },
        {
            name: "scale on hip and rightLeg is allowed because rightLeg is a child of root",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { hip: { scale: 1.1 }, rightLeg: { scale: 1.1 } } }),
            }),
            expectedIds: [],
        },
        {
            name: "scale on body and head is not allowed because head is a child of body",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { body: { scale: 1.1 }, head: { scale: 1.1 } } }),
            }),
            expectedIds: ["EMOTE/702"],
        },
        {
            name: "scale on hip and rightItem is not allowed because rightItem is a descendant of hip",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { hip: { scale: 1.1 }, rightItem: { scale: 1.1 } } }),
            }),
            expectedIds: ["EMOTE/702"],
        },
        {
            name: "scale on root and leftLeg is not allowed because leftLeg is a child of root",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: {
                        leftLeg: { scale: { "0.0": [1, 1, 1], "1.0": [0.9, 0.9, 0.9], "2.0": [1, 1, 1] } },
                        root: { scale: { "0.0": [1, 1, 1], "2.0": [1, 1, 1], "2.5": [1.1, 1.1, 1.1] } },
                    },
                }),
            }),
            expectedIds: ["EMOTE/702"],
        },
    ];

    static run(entry: ScaledChildOfScaledParentReportsScaledDescendantCase): Promise<Finding[]> {
        return PersonaFixture.run(new ScaledChildOfScaledParent(), entry.files, entry.contentType ?? "persona");
    }
}
