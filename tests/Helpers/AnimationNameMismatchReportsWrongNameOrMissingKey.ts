import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationNameMismatchReportsWrongNameOrMissingKeyCase } from "../Types/AnimationNameMismatchReportsWrongNameOrMissingKeyTypes.js";
import AnimationNameMismatch from "../../src/Checks/Emote/AnimationNameMismatch.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationNameMismatchReportsWrongNameOrMissingKey {
    static readonly ID = "EMOTE/203";
    static readonly CASES: readonly AnimationNameMismatchReportsWrongNameOrMissingKeyCase[] = [
        {
            name: "name animation.em_spright_wave is animation.<id> and is a key in the animation file",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "name animation.wave is not animation.<id>",
            files: PersonaFixture.emoteFiles({
                metaOverrides: { animation_sources: [{ name: "animation.wave", animationFile: "em_spright_wave.animation.json" }] },
            }),
            expectedIds: ["EMOTE/203"],
        },
        {
            name: "name animation.em_spright_wave is not a key in the animation file",
            files: PersonaFixture.emoteFiles({ animation: PersonaFixture.emoteAnimation({ name: "animation.em_spright_other" }) }),
            expectedIds: ["EMOTE/203"],
        },
    ];

    static run(entry: AnimationNameMismatchReportsWrongNameOrMissingKeyCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationNameMismatch(), entry.files, entry.contentType ?? "persona");
    }
}
