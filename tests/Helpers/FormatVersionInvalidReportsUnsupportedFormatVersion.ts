import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { FormatVersionInvalidReportsUnsupportedFormatVersionCase } from "../Types/FormatVersionInvalidReportsUnsupportedFormatVersionTypes.js";
import FormatVersionInvalid from "../../src/Checks/Manifest/FormatVersionInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class FormatVersionInvalidReportsUnsupportedFormatVersion {
    static readonly ID = "MANIFEST/202";
    static readonly CASES: readonly FormatVersionInvalidReportsUnsupportedFormatVersionCase[] = [
        {
            name: "format_version 2 is a supported manifest format",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
        },
        {
            name: "format_version 4 is not 1 2 or 3",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ format_version: 4 }) },
            expectedIds: ["MANIFEST/202"],
        },
        {
            name: "manifest without format_version is not 1 2 or 3",
            files: { "BP/manifest.json": ManifestFixture.withoutField(ModelFixture.behaviorManifest(), "format_version") },
            expectedIds: ["MANIFEST/202"],
        },
    ];

    static async run(entry: FormatVersionInvalidReportsUnsupportedFormatVersionCase): Promise<FindingSummary> {
        return ManifestFixture.run(new FormatVersionInvalid(), entry);
    }
}
