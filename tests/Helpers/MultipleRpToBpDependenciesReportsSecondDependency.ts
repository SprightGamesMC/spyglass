import type { MultipleRpToBpDependenciesReportsSecondDependencyCase } from "../Types/MultipleRpToBpDependenciesReportsSecondDependencyTypes.js";
import MultipleRpToBpDependencies from "../../src/Checks/Addon/MultipleRpToBpDependencies.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleRpToBpDependenciesReportsSecondDependency {
    static readonly ID = "ADDON/604";
    static readonly CASES: readonly MultipleRpToBpDependenciesReportsSecondDependencyCase[] = [
        {
            name: "one dependency on the behavior pack is exactly one dependency",
            resourceDependencies: [{ uuid: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedIds: [],
        },
        {
            name: "two dependencies is more than the one expected",
            resourceDependencies: [
                { uuid: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] },
                { uuid: ModelFixture.OTHER_UUID, version: [1, 0, 0] },
            ],
            expectedIds: ["ADDON/604"],
        },
    ];

    static async run(entry: MultipleRpToBpDependenciesReportsSecondDependencyCase): Promise<string[]> {
        const summary = await AddonFixture.run(new MultipleRpToBpDependencies(), AddonFixture.dependencyFiles(entry));

        return summary.ids;
    }
}
