import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { UuidDuplicateReportsRepeatedHeaderUuidCase } from "../Types/UuidDuplicateReportsRepeatedHeaderUuidTypes.js";
import UuidDuplicate from "../../src/Checks/Manifest/UuidDuplicate.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class UuidDuplicateReportsRepeatedHeaderUuid {
    static readonly ID = "MANIFEST/601";
    static readonly CASES: readonly UuidDuplicateReportsRepeatedHeaderUuidCase[] = [
        {
            name: "default manifest uses each uuid once",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "module uuid repeating the header uuid in upper case is a duplicate",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({
                    modules: [{ type: "data", uuid: ModelFixture.BEHAVIOR_UUID.toUpperCase(), version: [1, 0, 0] }],
                }),
            },
            expectedIds: ["MANIFEST/601"],
            expectedFields: [""],
        },
        {
            name: "dependency uuid repeating the header uuid is a duplicate",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }]),
            expectedIds: ["MANIFEST/601"],
            expectedFields: [""],
        },
        {
            name: "two modules with the invalid uuid bad are not compared",
            files: ManifestFixture.behaviorWithModules([
                { type: "data", uuid: "bad", version: [1, 0, 0] },
                { type: "script", uuid: "bad", version: [1, 0, 0] },
            ]),
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "dependency with a different uuid than the header is not a duplicate",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: ManifestFixture.PACK_UUID, version: [1, 0, 0] }]),
            expectedIds: [],
            expectedFields: [],
        },
    ];

    static async run(entry: UuidDuplicateReportsRepeatedHeaderUuidCase): Promise<FindingSummary> {
        return ManifestFixture.run(new UuidDuplicate(), entry);
    }
}
