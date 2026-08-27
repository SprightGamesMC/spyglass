import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingNameNotNamespacedReportsUnprefixedNameCase } from "../Types/SettingNameNotNamespacedReportsUnprefixedNameTypes.js";
import SettingNameNotNamespaced from "../../src/Checks/Manifest/SettingNameNotNamespaced.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingNameNotNamespacedReportsUnprefixedName {
    static readonly ID = "MANIFEST/218";
    static readonly CASES: readonly SettingNameNotNamespacedReportsUnprefixedNameCase[] = [
        {
            name: "setting names with test: prefix are namespaced",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "setting name toggle has no namespace prefix",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.TOGGLE, name: "toggle" }]),
            expectedIds: ["MANIFEST/218"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingNameNotNamespacedReportsUnprefixedNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingNameNotNamespaced(), entry);
    }
}
