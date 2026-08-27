import type { Finding } from "../../src/Types/CheckTypes.js";
import type { SoundDefinitionsCase } from "../Types/SoundDefinitionsInvalidGroupsIssuesByKindTypes.js";
import DefinitionsInvalid from "../../src/Checks/Sound/DefinitionsInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class SoundDefinitionsInvalidGroupsIssuesByKind {
    static readonly ID = "SOUND/201";
    static readonly PATH = "RP/sounds/sound_definitions.json";
    static readonly CASES: readonly SoundDefinitionsCase[] = [
        {
            name: "format_version 1.14.0 catalog with typed sound entries matches the schema",
            content: {
                format_version: "1.14.0",
                sound_definitions: {
                    "mob.thing.say": {
                        category: "neutral",
                        min_distance: null,
                        max_distance: 16,
                        __use_legacy_max_distance: "true",
                        sounds: ["sounds/mob/thing/say1", { name: "sounds/mob/thing/say2", volume: 0.5, pitch: 1.2, is3D: true }],
                    },
                },
            },
            expectedFields: [],
        },
        {
            name: "legacy catalog without format_version matches the legacy schema",
            content: { "mob.thing.say": { sounds: ["sounds/mob/thing/say1", { name: "sounds/mob/thing/say2" }] } },
            expectedFields: [],
        },
        {
            name: "sound name number and max_distance string are one wrong type finding and missing sounds is one missing field finding",
            content: {
                format_version: "1.14.0",
                sound_definitions: {
                    "mob.thing.say": { sounds: [{ name: 5 }, "ok"], max_distance: "far" },
                    "mob.thing.hurt": { category: "hostile" },
                },
            },
            expectedFields: ["sound_definitions.mob.thing.hurt.sounds", "sound_definitions.mob.thing.say.sounds[0]"],
        },
        {
            name: "legacy catalog entry without sounds is one missing field finding",
            content: { "mob.thing.say": { category: "neutral" } },
            expectedFields: ["mob.thing.say.sounds"],
        },
        { name: "unparseable catalog text is a file error not a schema error", content: "{", expectedFields: [] },
    ];

    static run(content: object | string): Promise<Finding[]> {
        const files = { "RP/manifest.json": ModelFixture.resourceManifest(), [SoundDefinitionsInvalidGroupsIssuesByKind.PATH]: content };

        return ModelFixture.findings(new DefinitionsInvalid(), files);
    }
}
