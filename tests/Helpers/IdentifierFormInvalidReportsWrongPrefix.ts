import type { IdentifierFormInvalidReportsWrongPrefixCase } from "../Types/IdentifierFormInvalidReportsWrongPrefixTypes.js";
import IdentifierFormInvalid from "../../src/Checks/Addon/IdentifierFormInvalid.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class IdentifierFormInvalidReportsWrongPrefix {
    static readonly ID = "ADDON/205";
    static readonly CASES: readonly IdentifierFormInvalidReportsWrongPrefixCase[] = [
        {
            name: "animation.spright_cave.idle has the animation prefix",
            path: AddonFixture.RP + "animations/cow.animation.json",
            content: { format_version: "1.8.0", animations: { "animation.spright_cave.idle": {} } },
            expectedFields: [],
        },
        {
            name: "spright_cave.idle lacks the animation prefix",
            path: AddonFixture.RP + "animations/cow.animation.json",
            content: { format_version: "1.8.0", animations: { "spright_cave.idle": {} } },
            expectedFields: ["animations.spright_cave.idle"],
        },
        {
            name: "animation controller controller.render.spright_cave.cow uses the render prefix instead of controller.animation",
            path: AddonFixture.RP + "animation_controllers/cow.json",
            content: { format_version: "1.10.0", animation_controllers: { "controller.render.spright_cave.cow": {} } },
            expectedFields: ["animation_controllers.controller.render.spright_cave.cow"],
        },
        {
            name: "geometry entry without an identifier in a 1.12.0 geometry file is not checked",
            path: AddonFixture.RP + "models/entity/cow.geo.json",
            content: { format_version: "1.12.0", "minecraft:geometry": [{ bones: [] }] },
            expectedFields: [],
        },
        {
            name: "spright_cave.cow in a 1.12.0 geometry file lacks the geometry prefix",
            path: AddonFixture.RP + "models/entity/cow.geo.json",
            content: { format_version: "1.12.0", "minecraft:geometry": [{ description: { identifier: "spright_cave.cow" }, bones: [] }] },
            expectedFields: ["minecraft:geometry[0].description.identifier"],
        },
    ];

    static async run(entry: IdentifierFormInvalidReportsWrongPrefixCase): Promise<string[]> {
        const summary = await AddonFixture.run(new IdentifierFormInvalid(), AddonFixture.pairFiles({ [entry.path]: entry.content }));

        return summary.fields;
    }
}
