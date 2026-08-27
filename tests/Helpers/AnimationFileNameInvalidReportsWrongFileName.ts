import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationFileNameInvalidReportsWrongFileNameCase } from "../Types/AnimationFileNameInvalidReportsWrongFileNameTypes.js";
import AnimationFileNameInvalid from "../../src/Checks/Emote/AnimationFileNameInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationFileNameInvalidReportsWrongFileName {
    static readonly ID = "EMOTE/201";
    static readonly CASES: readonly AnimationFileNameInvalidReportsWrongFileNameCase[] = [
        { name: "em_spright_wave.animation.json is the <id>.animation.json form", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "em_spright_wave.json is not the <id>.animation.json form",
            files: PersonaFixture.emoteFiles({
                metaOverrides: { animation_sources: [{ name: PersonaFixture.EMOTE_ANIMATION, animationFile: "em_spright_wave.json" }] },
            }),
            expectedIds: ["EMOTE/201"],
        },
    ];

    static run(entry: AnimationFileNameInvalidReportsWrongFileNameCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationFileNameInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
