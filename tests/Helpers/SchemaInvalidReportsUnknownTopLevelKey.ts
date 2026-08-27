import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SchemaInvalidReportsUnknownTopLevelKeyCase } from "../Types/SchemaInvalidReportsUnknownTopLevelKeyTypes.js";
import SchemaInvalid from "../../src/Checks/Manifest/SchemaInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SchemaInvalidReportsUnknownTopLevelKey {
    static readonly ID = "MANIFEST/201";
    static readonly CASES: readonly SchemaInvalidReportsUnknownTopLevelKeyCase[] = [
        {
            name: "behavior manifest with known keys and typed values matches the schema",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "extra top level key is not in the manifest schema",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ extra: true }) },
            expectedIds: ["MANIFEST/201"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "header string is not the object the schema expects",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ header: "text" }) },
            expectedIds: ["MANIFEST/201"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "manifest without modules lacks a required schema section",
            files: { "BP/manifest.json": ManifestFixture.withoutField(ModelFixture.behaviorManifest(), "modules") },
            expectedIds: ["MANIFEST/201"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "module uuid number is not the string the schema expects",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ modules: [{ type: "data", uuid: 5, version: [1, 0, 0] }] }) },
            expectedIds: ["MANIFEST/201"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "unparseable manifest text is a file error not a schema error",
            files: { "BP/manifest.json": "{ not json" },
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static async run(entry: SchemaInvalidReportsUnknownTopLevelKeyCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SchemaInvalid(), entry);
    }
}
