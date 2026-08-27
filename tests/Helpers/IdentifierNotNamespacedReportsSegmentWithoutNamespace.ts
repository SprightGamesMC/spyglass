import type { IdentifierNotNamespacedReportsSegmentWithoutNamespaceCase } from "../Types/IdentifierNotNamespacedReportsSegmentWithoutNamespaceTypes.js";
import IdentifierNotNamespaced from "../../src/Checks/Addon/IdentifierNotNamespaced.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class IdentifierNotNamespacedReportsSegmentWithoutNamespace {
    static readonly ID = "ADDON/206";
    static readonly CASES: readonly IdentifierNotNamespacedReportsSegmentWithoutNamespaceCase[] = [
        {
            name: "geometry.spright_cave.cow in a 1.12.0 geometry file has a namespace token",
            path: AddonFixture.RP + "models/entity/cow.geo.json",
            content: {
                format_version: "1.12.0",
                "minecraft:geometry": [{ description: { identifier: "geometry.spright_cave.cow" }, bones: [] }],
            },
            expectedFields: [],
        },
        {
            name: "spright_cave.idle without the animation prefix is left to the prefix form check",
            path: AddonFixture.RP + "animations/cow.animation.json",
            content: { format_version: "1.8.0", animations: { "spright_cave.idle": {} } },
            expectedFields: [],
        },
        {
            name: "animation.cow.idle has no namespace token after the prefix",
            path: AddonFixture.RP + "animations/cow.animation.json",
            content: { format_version: "1.8.0", animations: { "animation.cow.idle": {} } },
            expectedFields: ["animations.animation.cow.idle"],
        },
        {
            name: "controller.render.cow has no namespace token after the prefix",
            path: AddonFixture.RP + "render_controllers/cow.json",
            content: { format_version: "1.10.0", render_controllers: { "controller.render.cow": {} } },
            expectedFields: ["render_controllers.controller.render.cow"],
        },
        {
            name: "geometry.cow in a 1.8.0 geometry file has no namespace token",
            path: AddonFixture.RP + "models/entity/cow.geo.json",
            content: { format_version: "1.8.0", "geometry.cow": { bones: [] } },
            expectedFields: ["geometry.cow"],
        },
        {
            name: "controller.animation.cow.idle in the behavior pack has only a single token so it is not namespaced",
            path: AddonFixture.BP + "animation_controllers/cow.json",
            content: { format_version: "1.10.0", animation_controllers: { "controller.animation.cow.idle": {} } },
            expectedFields: ["animation_controllers.controller.animation.cow.idle"],
        },
    ];

    static async run(entry: IdentifierNotNamespacedReportsSegmentWithoutNamespaceCase): Promise<string[]> {
        const summary = await AddonFixture.run(new IdentifierNotNamespaced(), AddonFixture.pairFiles({ [entry.path]: entry.content }));

        return summary.fields;
    }
}
