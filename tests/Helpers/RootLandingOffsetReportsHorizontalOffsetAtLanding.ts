import type { Finding } from "../../src/Types/CheckTypes.js";
import type { RootLandingOffsetReportsHorizontalOffsetAtLandingCase } from "../Types/RootLandingOffsetReportsHorizontalOffsetAtLandingTypes.js";
import RootLandingOffset from "../../src/Checks/Emote/RootLandingOffset.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class RootLandingOffsetReportsHorizontalOffsetAtLanding {
    static readonly ID = "EMOTE/404";
    static readonly CASES: readonly RootLandingOffsetReportsHorizontalOffsetAtLandingCase[] = [
        {
            name: "root reaching Y 0 with X and Z at 0 lands at the origin",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [2, 8, 2], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "horizontal movement inside the 4 limit while Y stays 0 has no landing",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [4, 0, -4], "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: [],
        },
        {
            name: "root reaching Y 0 with X 2 lands away from the origin",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 8, 0], "2.0": [2, 0, 0], "3.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/404"],
            expectedFields: ["animations.animation.em_spright_wave.bones.root.position.2"],
        },
        {
            name: "root reaching Y 0 with Z minus 1 lands away from the origin",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 0, 0], "1.0": [0, 8, 0], "2.0": [0, 0, -1], "3.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/404"],
        },
        {
            name: "root post value Y 0 with X 2 right after pre value Y 5 lands away from the origin",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({
                    bones: { root: { position: { "0.0": [0, 5, 0], "1.0": { pre: [0, 5, 0], post: [2, 0, 0] }, "2.0": [0, 0, 0] } } },
                }),
            }),
            expectedIds: ["EMOTE/404"],
        },
    ];

    static run(entry: RootLandingOffsetReportsHorizontalOffsetAtLandingCase): Promise<Finding[]> {
        return PersonaFixture.run(new RootLandingOffset(), entry.files, entry.contentType ?? "persona");
    }
}
