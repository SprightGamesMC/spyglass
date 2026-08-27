import type { RpToBpDependencyMissingReportsResourcePackWithoutDependencyCase } from "../Types/RpToBpDependencyMissingReportsResourcePackWithoutDependencyTypes.js";
import RpToBpDependencyMissing from "../../src/Checks/Addon/RpToBpDependencyMissing.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class RpToBpDependencyMissingReportsResourcePackWithoutDependency {
    static readonly ID = "ADDON/104";
    static readonly CASES: readonly RpToBpDependencyMissingReportsResourcePackWithoutDependencyCase[] = [
        {
            name: "resource pack with a behavior pack dependency has a dependency",
            resourceDependencies: [{ uuid: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedIds: [],
        },
        { name: "resource pack with no dependencies has no dependency", expectedIds: ["ADDON/104"] },
    ];

    static async run(entry: RpToBpDependencyMissingReportsResourcePackWithoutDependencyCase): Promise<string[]> {
        const summary = await AddonFixture.run(new RpToBpDependencyMissing(), AddonFixture.dependencyFiles(entry));

        return summary.ids;
    }
}
