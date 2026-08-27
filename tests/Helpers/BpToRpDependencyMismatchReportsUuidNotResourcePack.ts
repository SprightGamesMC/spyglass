import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BpToRpDependencyMismatchReportsUuidNotResourcePackCase } from "../Types/BpToRpDependencyMismatchReportsUuidNotResourcePackTypes.js";
import BpToRpDependencyMismatch from "../../src/Checks/Addon/BpToRpDependencyMismatch.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BpToRpDependencyMismatchReportsUuidNotResourcePack {
    static readonly ID = "ADDON/301";
    static readonly CASES: readonly BpToRpDependencyMismatchReportsUuidNotResourcePackCase[] = [
        {
            name: "dependency uuid equal to the resource pack uuid matches",
            behaviorDependencies: [{ uuid: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] }],
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "upper case dependency uuid matches because uuid comparison ignores case",
            behaviorDependencies: [{ uuid: ModelFixture.RESOURCE_UUID.toUpperCase(), version: [1, 0, 0] }],
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "dependency uuid that is not the resource pack uuid is mismatched",
            behaviorDependencies: [{ uuid: ModelFixture.OTHER_UUID, version: [1, 0, 0] }],
            expectedIds: ["ADDON/301"],
            expectedFields: ["dependencies[0].uuid"],
        },
        {
            name: "mismatched pack dependency after a script module is reported at its own index",
            behaviorDependencies: [AddonFixture.SCRIPT_DEPENDENCY, { uuid: ModelFixture.OTHER_UUID, version: [1, 0, 0] }],
            expectedIds: ["ADDON/301"],
            expectedFields: ["dependencies[1].uuid"],
        },
    ];

    static async run(entry: BpToRpDependencyMismatchReportsUuidNotResourcePackCase): Promise<FindingSummary> {
        return AddonFixture.run(new BpToRpDependencyMismatch(), AddonFixture.dependencyFiles(entry));
    }
}
