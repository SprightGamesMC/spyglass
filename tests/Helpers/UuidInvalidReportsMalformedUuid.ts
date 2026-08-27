import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { UuidInvalidReportsMalformedUuidCase } from "../Types/UuidInvalidReportsMalformedUuidTypes.js";
import UuidInvalid from "../../src/Checks/Manifest/UuidInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class UuidInvalidReportsMalformedUuid {
    static readonly ID = "MANIFEST/203";
    static readonly CASES: readonly UuidInvalidReportsMalformedUuidCase[] = [
        {
            name: "header uuid in the default manifest is a valid uuid",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "header uuid not-a-uuid is not a valid uuid",
            files: { "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest(), { uuid: "not-a-uuid" }) },
            expectedIds: ["MANIFEST/203"],
            expectedFields: ["header.uuid"],
        },
        {
            name: "missing header uuid is not a valid uuid",
            files: { "BP/manifest.json": ManifestFixture.withoutHeaderField(ModelFixture.behaviorManifest(), "uuid") },
            expectedIds: ["MANIFEST/203"],
            expectedFields: ["header.uuid"],
        },
        {
            name: "module uuid 1234 is not a valid uuid",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ modules: [{ type: "data", uuid: "1234", version: [1, 0, 0] }] }) },
            expectedIds: ["MANIFEST/203"],
            expectedFields: ["modules[0].uuid"],
        },
        {
            name: "dependency uuid 1234 is not a valid uuid",
            files: ManifestFixture.behaviorWithDependencies([{ uuid: "1234", version: [1, 0, 0] }]),
            expectedIds: ["MANIFEST/203"],
            expectedFields: ["dependencies[0].uuid"],
        },
        {
            name: "dependency with module_name and no uuid has no uuid to validate",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server", version: "1.2.0" }]),
            expectedIds: [],
            expectedFields: [],
        },
    ];

    static async run(entry: UuidInvalidReportsMalformedUuidCase): Promise<FindingSummary> {
        return ManifestFixture.run(new UuidInvalid(), entry);
    }
}
