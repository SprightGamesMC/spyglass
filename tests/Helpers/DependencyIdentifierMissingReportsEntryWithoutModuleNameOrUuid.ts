import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuidCase } from "../Types/DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuidTypes.js";
import DependencyIdentifierMissing from "../../src/Checks/Manifest/DependencyIdentifierMissing.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid {
    static readonly ID = "MANIFEST/102";
    static readonly CASES: readonly DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuidCase[] = [
        {
            name: "module_name and uuid dependencies each have an identifier",
            files: ManifestFixture.behaviorWithDependencies(ManifestFixture.VALID_DEPENDENCIES),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dependency with only a version has neither module_name nor uuid",
            files: ManifestFixture.behaviorWithDependencies([{ version: [1, 0, 0] }]),
            expectedIds: ["MANIFEST/102"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuidCase): Promise<FindingSummary> {
        return ManifestFixture.run(new DependencyIdentifierMissing(), entry);
    }
}
