import type { BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependencyCase } from "../Types/BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependencyTypes.js";
import BpToRpDependencyMissing from "../../src/Checks/Addon/BpToRpDependencyMissing.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency {
    static readonly ID = "ADDON/103";
    static readonly CASES: readonly BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependencyCase[] = [
        {
            name: "behavior pack with a resource pack dependency and a script module has a pack dependency",
            behaviorDependencies: [{ uuid: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] }, AddonFixture.SCRIPT_DEPENDENCY],
            expectedIds: [],
        },
        { name: "behavior pack with no dependencies has no pack dependency", expectedIds: ["ADDON/103"] },
        {
            name: "behavior pack with only a script dependency has no pack dependency",
            behaviorDependencies: [AddonFixture.SCRIPT_DEPENDENCY],
            expectedIds: ["ADDON/103"],
        },
    ];

    static async run(entry: BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependencyCase): Promise<string[]> {
        const summary = await AddonFixture.run(new BpToRpDependencyMissing(), AddonFixture.dependencyFiles(entry));

        return summary.ids;
    }
}
