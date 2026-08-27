import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StringVersionRequiresFormat3ReportsStringVersionBelowFormat3Case } from "../Types/StringVersionRequiresFormat3ReportsStringVersionBelowFormat3Types.js";
import StringVersionRequiresFormat3 from "../../src/Checks/Manifest/StringVersionRequiresFormat3.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class StringVersionRequiresFormat3ReportsStringVersionBelowFormat3 {
    static readonly ID = "MANIFEST/206";
    static readonly CASES: readonly StringVersionRequiresFormat3ReportsStringVersionBelowFormat3Case[] = [
        {
            name: "array version fields do not need format_version 3",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "string header.version 1.0.0 with format_version 2 needs format 3",
            files: {
                "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest({ format_version: 2 }), { version: "1.0.0" }),
            },
            expectedIds: ["MANIFEST/206"],
            expectedFields: ["header.version"],
        },
        {
            name: "string modules[0].version 1.0.0 with format_version 2 needs format 3",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({
                    modules: [{ type: "data", uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: "1.0.0" }],
                }),
            },
            expectedIds: ["MANIFEST/206"],
            expectedFields: ["modules[0].version"],
        },
        {
            name: "string dependencies[0].version 1.0.0 with a uuid and format_version 2 needs format 3",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({
                    format_version: 2,
                    dependencies: [{ uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: "1.0.0" }],
                }),
            },
            expectedIds: ["MANIFEST/206"],
            expectedFields: ["dependencies[0].version"],
        },
        {
            name: "string dependencies[0].version 2.0.0 with module_name @minecraft/server and format_version 2 is allowed",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({
                    format_version: 2,
                    dependencies: [{ module_name: "@minecraft/server", version: "2.0.0" }],
                }),
            },
            expectedIds: [],
            expectedFields: [],
        },
        {
            name: "string header.version 1.0.0 with format_version 3 is allowed",
            files: {
                "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest({ format_version: 3 }), { version: "1.0.0" }),
            },
            expectedIds: [],
            expectedFields: [],
        },
    ];

    static async run(entry: StringVersionRequiresFormat3ReportsStringVersionBelowFormat3Case): Promise<FindingSummary> {
        return ManifestFixture.run(new StringVersionRequiresFormat3(), entry);
    }
}
