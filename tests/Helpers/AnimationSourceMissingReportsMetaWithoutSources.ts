import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimationSourceMissingReportsMetaWithoutSourcesCase } from "../Types/AnimationSourceMissingReportsMetaWithoutSourcesTypes.js";
import AnimationSourceMissing from "../../src/Checks/Emote/AnimationSourceMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimationSourceMissingReportsMetaWithoutSources {
    static readonly ID = "EMOTE/101";
    static readonly CASES: readonly AnimationSourceMissingReportsMetaWithoutSourcesCase[] = [
        { name: "meta with one animation_sources entry has an animation source", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "meta without animation_sources has no animation source",
            files: PersonaFixture.emoteFiles({ metaOverrides: { animation_sources: undefined } }),
            expectedIds: ["EMOTE/101"],
        },
        {
            name: "meta with empty animation_sources has no animation source",
            files: PersonaFixture.emoteFiles({ metaOverrides: { animation_sources: [] } }),
            expectedIds: ["EMOTE/101"],
        },
    ];

    static run(entry: AnimationSourceMissingReportsMetaWithoutSourcesCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimationSourceMissing(), entry.files, entry.contentType ?? "persona");
    }
}
