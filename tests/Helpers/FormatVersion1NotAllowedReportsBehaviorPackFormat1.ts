import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { FormatVersion1NotAllowedReportsBehaviorPackFormat1Case } from "../Types/FormatVersion1NotAllowedReportsBehaviorPackFormat1Types.js";
import FormatVersion1NotAllowed from "../../src/Checks/Manifest/FormatVersion1NotAllowed.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class FormatVersion1NotAllowedReportsBehaviorPackFormat1 {
    static readonly ID = "MANIFEST/501";
    static readonly CASES: readonly FormatVersion1NotAllowedReportsBehaviorPackFormat1Case[] = [
        {
            name: "behavior pack with format_version 2 is not format 1",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedIds: [],
        },
        {
            name: "behavior pack with format_version 1 is not allowed format 1",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ format_version: 1 }) },
            expectedIds: ["MANIFEST/501"],
        },
        {
            name: "world template with format_version 1 is not allowed format 1",
            files: { "WT/manifest.json": ModelFixture.worldTemplateManifest({ format_version: 1 }) },
            expectedIds: ["MANIFEST/501"],
        },
        {
            name: "skin pack with format_version 1 is exempt from the format 1 rule",
            files: { "SP/manifest.json": ModelFixture.skinManifest() },
            expectedIds: [],
        },
        {
            name: "persona pack with format_version 1 is exempt from the format 1 rule",
            files: { "PP/manifest.json": ModelFixture.personaManifest() },
            expectedIds: [],
        },
    ];

    static async run(entry: FormatVersion1NotAllowedReportsBehaviorPackFormat1Case): Promise<FindingSummary> {
        return ManifestFixture.run(new FormatVersion1NotAllowed(), entry);
    }
}
