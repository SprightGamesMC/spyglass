import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ChannelValueNotNumericReportsOtherChannelsCase } from "../Types/ChannelValueNotNumericReportsOtherChannelsTypes.js";
import ChannelValueNotNumeric from "../../src/Checks/Emote/ChannelValueNotNumeric.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ChannelValueNotNumericReportsOtherChannels {
    static readonly ID = "EMOTE/212";
    static readonly CASES: readonly ChannelValueNotNumericReportsOtherChannelsCase[] = [
        {
            name: "numeric string 1.5 in rotation is a number",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": ["1.5", 0, 0] } } } }),
            }),
            expectedIds: [],
        },
        {
            name: "Molang expression in root position is reported by the error check instead",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { root: { position: { "0.0": [0, "math.sin(1)", 0] } } } }),
            }),
            expectedIds: [],
        },
        {
            name: "Molang expression in rotation is not a number",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { rotation: { "0.0": ["math.sin(1)", 0, 0] } } } }),
            }),
            expectedIds: ["EMOTE/212"],
        },
        {
            name: "Molang expression in head position is not a number",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ bones: { head: { position: ["math.sin(1)", 0, 0] } } }),
            }),
            expectedIds: ["EMOTE/212"],
        },
    ];

    static run(entry: ChannelValueNotNumericReportsOtherChannelsCase): Promise<Finding[]> {
        return PersonaFixture.run(new ChannelValueNotNumeric(), entry.files, entry.contentType ?? "persona");
    }
}
