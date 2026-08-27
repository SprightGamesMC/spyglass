import type { MultipleBpToRpDependenciesReportsSecondPackDependencyCase } from "../Types/MultipleBpToRpDependenciesReportsSecondPackDependencyTypes.js";
import MultipleBpToRpDependencies from "../../src/Checks/Addon/MultipleBpToRpDependencies.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleBpToRpDependenciesReportsSecondPackDependency {
    static readonly ID = "ADDON/603";
    static readonly CASES: readonly MultipleBpToRpDependenciesReportsSecondPackDependencyCase[] = [
        {
            name: "one pack dependency plus a script module is exactly one pack dependency",
            behaviorDependencies: [{ uuid: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] }, AddonFixture.SCRIPT_DEPENDENCY],
            expectedIds: [],
        },
        {
            name: "two pack dependencies is more than the one expected",
            behaviorDependencies: [
                { uuid: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] },
                { uuid: ModelFixture.OTHER_UUID, version: [1, 0, 0] },
            ],
            expectedIds: ["ADDON/603"],
        },
    ];

    static async run(entry: MultipleBpToRpDependenciesReportsSecondPackDependencyCase): Promise<string[]> {
        const summary = await AddonFixture.run(new MultipleBpToRpDependencies(), AddonFixture.dependencyFiles(entry));

        return summary.ids;
    }
}
