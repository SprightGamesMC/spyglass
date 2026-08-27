import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { UseBetaFeaturesReportsTrueFlagCase } from "../Types/UseBetaFeaturesReportsTrueFlagTypes.js";
import UseBetaFeatures from "../../src/Checks/Script/UseBetaFeatures.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class UseBetaFeaturesReportsTrueFlag {
    static readonly ID = "SCRIPT/701";
    static readonly CASES: readonly UseBetaFeaturesReportsTrueFlagCase[] = [
        {
            name: "use_beta_features false in manifest and entity is not a true flag",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({ use_beta_features: false }),
                "BP/entities/a.json": {
                    format_version: ModelFixture.DEFAULT_GAME_VERSION,
                    "minecraft:entity": { description: { identifier: "x:a", use_beta_features: false } },
                },
            },
            expectedIds: [],
            expectedPaths: [],
            expectedFields: [],
        },
        {
            name: "use_beta_features true in the manifest header is a true flag",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest({
                    header: { ...(ModelFixture.behaviorManifest().header as object), use_beta_features: true },
                }),
            },
            expectedIds: ["SCRIPT/701"],
            expectedPaths: ["BP/manifest.json"],
            expectedFields: ["header.use_beta_features"],
        },
        {
            name: "use_beta_features true at the manifest top level is a true flag",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ use_beta_features: true }) },
            expectedIds: ["SCRIPT/701"],
            expectedPaths: ["BP/manifest.json"],
            expectedFields: ["use_beta_features"],
        },
        {
            name: "use_beta_features true in block description and item file are true flags",
            files: {
                "BP/manifest.json": ModelFixture.behaviorManifest(),
                "BP/blocks/b.json": {
                    format_version: ModelFixture.DEFAULT_GAME_VERSION,
                    "minecraft:block": { description: { identifier: "x:b", use_beta_features: true } },
                },
                "BP/items/i.json": {
                    format_version: ModelFixture.DEFAULT_GAME_VERSION,
                    "minecraft:item": { description: { identifier: "x:i" } },
                    use_beta_features: true,
                },
            },
            expectedIds: ["SCRIPT/701", "SCRIPT/701"],
            expectedPaths: ["BP/blocks/b.json", "BP/items/i.json"],
            expectedFields: ["minecraft:block.description.use_beta_features", "use_beta_features"],
        },
        {
            name: "use_beta_features true in a manifest nested in a world is reported once",
            files: {
                "World/manifest.json": ModelFixture.worldTemplateManifest(),
                "World/behavior_packs/BP/manifest.json": ModelFixture.behaviorManifest({ use_beta_features: true }),
            },
            expectedIds: ["SCRIPT/701"],
            expectedPaths: ["World/behavior_packs/BP/manifest.json"],
            expectedFields: ["use_beta_features"],
        },
    ];

    static run(entry: UseBetaFeaturesReportsTrueFlagCase): Promise<FindingSummary> {
        return ModelFixture.summary(new UseBetaFeatures(), entry.files);
    }
}
