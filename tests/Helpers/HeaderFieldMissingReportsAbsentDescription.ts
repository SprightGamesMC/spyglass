import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { HeaderFieldMissingReportsAbsentDescriptionCase } from "../Types/HeaderFieldMissingReportsAbsentDescriptionTypes.js";
import HeaderFieldMissing from "../../src/Checks/Manifest/HeaderFieldMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class HeaderFieldMissingReportsAbsentDescription {
    static readonly ID = "MANIFEST/101";
    static readonly CASES: readonly HeaderFieldMissingReportsAbsentDescriptionCase[] = [
        {
            name: "behavior pack with description and min_engine_version has every required header field",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "behavior pack without description lacks a required header field",
            files: { "BP/manifest.json": ManifestFixture.withoutHeaderField(ModelFixture.behaviorManifest(), "description") },
            expectedIds: ["MANIFEST/101"],
            expectedFields: ["header.description"],
        },
        {
            name: "behavior pack with empty description lacks a required header field",
            files: { "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest(), { description: "" }) },
            expectedIds: ["MANIFEST/101"],
            expectedFields: ["header.description"],
        },
        {
            name: "skin pack without description is exempt from the description rule",
            files: { "SP/manifest.json": ModelFixture.skinManifest() },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "behavior pack without min_engine_version lacks a required header field",
            files: { "BP/manifest.json": ManifestFixture.withoutHeaderField(ModelFixture.behaviorManifest(), "min_engine_version") },
            expectedIds: ["MANIFEST/101"],
            expectedFields: ["header.min_engine_version"],
        },
        {
            name: "resource pack format_version 2 without min_engine_version lacks a required header field",
            files: { "RP/manifest.json": ManifestFixture.withoutHeaderField(ModelFixture.resourceManifest(), "min_engine_version") },
            expectedIds: ["MANIFEST/101"],
            expectedFields: ["header.min_engine_version"],
        },
        {
            name: "resource pack format_version 1 does not require min_engine_version",
            files: {
                "RP/manifest.json": ManifestFixture.withoutHeaderField(
                    ModelFixture.resourceManifest({ format_version: 1 }),
                    "min_engine_version"
                ),
            },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "world template does not require min_engine_version",
            files: { "WT/manifest.json": ModelFixture.worldTemplateManifest() },
            expectedIds: [],
            expectedFields: [],
        },
    ];

    static async run(entry: HeaderFieldMissingReportsAbsentDescriptionCase): Promise<FindingSummary> {
        return ManifestFixture.run(new HeaderFieldMissing(), entry);
    }
}
