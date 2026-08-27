import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ExperimentalTypeNotAllowedReportsExperimentalDefinitionCase } from "../Types/ExperimentalTypeNotAllowedReportsExperimentalDefinitionTypes.js";
import ExperimentalTypeNotAllowed from "../../src/Checks/Pack/ExperimentalTypeNotAllowed.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ExperimentalTypeNotAllowedReportsExperimentalDefinition {
    static readonly ID = "PACK/701";
    static readonly CASES: readonly ExperimentalTypeNotAllowedReportsExperimentalDefinitionCase[] = [
        { name: "entities/zombie.json is not an experimental definition type", packPath: "entities/zombie.json", expectFinding: false },
        {
            name: "aim_assist/presets/default.json is an experimental definition type",
            packPath: "aim_assist/presets/default.json",
            expectFinding: true,
        },
        {
            name: "aim_assist/categories/categories.json is an experimental definition type",
            packPath: "aim_assist/categories/categories.json",
            expectFinding: true,
        },
        { name: "behavior_trees/tree.json is an experimental definition type", packPath: "behavior_trees/tree.json", expectFinding: true },
        { name: "spawn_groups/group.json is an experimental definition type", packPath: "spawn_groups/group.json", expectFinding: true },
        {
            name: "worldgen/structures/village.json is a jigsaw type that is no longer experimental",
            packPath: "worldgen/structures/village.json",
            expectFinding: false,
        },
    ];

    static run(packPath: string): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), ["BP/" + packPath]: "{}" };
        return ModelFixture.findings(new ExperimentalTypeNotAllowed(), files);
    }
}
