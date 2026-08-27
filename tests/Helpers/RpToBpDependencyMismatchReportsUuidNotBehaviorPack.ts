import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { RpToBpDependencyMismatchReportsUuidNotBehaviorPackCase } from "../Types/RpToBpDependencyMismatchReportsUuidNotBehaviorPackTypes.js";
import RpToBpDependencyMismatch from "../../src/Checks/Addon/RpToBpDependencyMismatch.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class RpToBpDependencyMismatchReportsUuidNotBehaviorPack {
    static readonly ID = "ADDON/302";
    static readonly CASES: readonly RpToBpDependencyMismatchReportsUuidNotBehaviorPackCase[] = [
        {
            name: "dependency uuid equal to the behavior pack uuid matches",
            resourceDependencies: [{ uuid: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "upper case dependency uuid matches because uuid comparison ignores case",
            resourceDependencies: [{ uuid: ModelFixture.BEHAVIOR_UUID.toUpperCase(), version: [1, 0, 0] }],
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "dependency uuid that is not the behavior pack uuid is mismatched",
            resourceDependencies: [{ uuid: ModelFixture.OTHER_UUID, version: [1, 0, 0] }],
            expectedIds: ["ADDON/302"],
            expectedFields: ["dependencies[0].uuid"],
        },
    ];

    static async run(entry: RpToBpDependencyMismatchReportsUuidNotBehaviorPackCase): Promise<FindingSummary> {
        return AddonFixture.run(new RpToBpDependencyMismatch(), AddonFixture.dependencyFiles(entry));
    }
}
