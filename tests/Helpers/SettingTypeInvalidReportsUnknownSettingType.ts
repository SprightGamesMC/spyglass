import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingTypeInvalidReportsUnknownSettingTypeCase } from "../Types/SettingTypeInvalidReportsUnknownSettingTypeTypes.js";
import SettingTypeInvalid from "../../src/Checks/Manifest/SettingTypeInvalid.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingTypeInvalidReportsUnknownSettingType {
    static readonly ID = "MANIFEST/215";
    static readonly CASES: readonly SettingTypeInvalidReportsUnknownSettingTypeCase[] = [
        {
            name: "label, toggle, slider and dropdown are recognized setting types",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "setting type color is not recognized",
            files: ManifestFixture.behaviorWithSettings([{ type: "color", text: "Color" }]),
            expectedIds: ["MANIFEST/215"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "setting without a type field has no recognized type",
            files: ManifestFixture.behaviorWithSettings([{ text: "Info" }]),
            expectedIds: ["MANIFEST/215"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingTypeInvalidReportsUnknownSettingTypeCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingTypeInvalid(), entry);
    }
}
