import type { Finding } from "../../src/Types/CheckTypes.js";
import type { LimitedChannelValueNotNumericReportsRootPositionAndScaleCase } from "../Types/LimitedChannelValueNotNumericReportsRootPositionAndScaleTypes.js";
import LimitedChannelValueNotNumeric from "../../src/Checks/Emote/LimitedChannelValueNotNumeric.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class LimitedChannelValueNotNumericReportsRootPositionAndScale {
    static readonly ID = "EMOTE/211";
    static readonly CASES: readonly LimitedChannelValueNotNumericReportsRootPositionAndScaleCase[] = [
        {
            name: "numeric string 1.5 in root position is a number",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { root: { position: { "0.0": [0, "1.5", 0], "1.0": [0, 0, 0] } } } }),
            }),
            expectedIds: [],
        },
        {
            name: "Molang expression in rotation is not a limited channel",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": ["math.sin(1)", 0, 0] } } } }),
            }),
            expectedIds: [],
        },
        {
            name: "Molang expression in root position cannot be proved against the limits",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, "math.sin(1)", 0], "1.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/211"],
        },
        {
            name: "Molang expression in the post value of a head scale keyframe cannot be proved against the limits",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { head: { scale: { "0.0": { pre: [1, 1, 1], post: ["math.sin(1)", 1, 1] } } } },
                }),
            }),
            expectedIds: ["EMOTE/211"],
        },
        {
            name: "single Molang expression as the body scale channel value cannot be proved against the limits",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { body: { scale: "1 + math.sin(1)" } } }),
            }),
            expectedIds: ["EMOTE/211"],
        },
        {
            name: "empty string in a scale vector is not a number",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ bones: { body: { scale: ["", 1, 1] } } }) }),
            expectedIds: ["EMOTE/211"],
        },
    ];

    static run(entry: LimitedChannelValueNotNumericReportsRootPositionAndScaleCase): Promise<Finding[]> {
        return PersonaFixture.run(new LimitedChannelValueNotNumeric(), entry.files, entry.contentType ?? "persona");
    }
}
