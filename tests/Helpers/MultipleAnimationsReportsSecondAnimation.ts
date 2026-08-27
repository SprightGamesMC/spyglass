import type { Finding } from "../../src/Types/CheckTypes.js";
import type { MultipleAnimationsReportsSecondAnimationCase } from "../Types/MultipleAnimationsReportsSecondAnimationTypes.js";
import MultipleAnimations from "../../src/Checks/Emote/MultipleAnimations.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class MultipleAnimationsReportsSecondAnimation {
    static readonly ID = "EMOTE/601";
    static readonly CASES: readonly MultipleAnimationsReportsSecondAnimationCase[] = [
        {
            name: "animation file with one animation is within the single animation limit",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "animation file with animation.em_spright_other as a second animation defines more than one",
            files: PersonaFixture.emoteFiles({
                animation: PersonaFixture.emoteAnimation({ extraAnimations: { "animation.em_spright_other": { animation_length: 1 } } }),
            }),
            expectedIds: ["EMOTE/601"],
        },
    ];

    static run(entry: MultipleAnimationsReportsSecondAnimationCase): Promise<Finding[]> {
        return PersonaFixture.run(new MultipleAnimations(), entry.files, entry.contentType ?? "persona");
    }
}
