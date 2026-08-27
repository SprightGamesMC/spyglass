import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { VersionInvalidReportsUnparseableDependencyVersionCase } from "../Types/VersionInvalidReportsUnparseableDependencyVersionTypes.js";
import VersionInvalid from "../../src/Checks/Manifest/VersionInvalid.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class VersionInvalidReportsUnparseableDependencyVersion {
    static readonly ID = "MANIFEST/212";
    static readonly CASES: readonly VersionInvalidReportsUnparseableDependencyVersionCase[] = [
        {
            name: "versions 1.2.0 and 1 0 0 both parse",
            files: ManifestFixture.behaviorWithDependencies(ManifestFixture.VALID_DEPENDENCIES),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "version latest cannot be parsed",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server", version: "latest" }]),
            expectedIds: ["MANIFEST/212"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "dependency with no version has nothing to parse",
            files: ManifestFixture.behaviorWithDependencies([{ module_name: "@minecraft/server" }]),
            expectedIds: ["MANIFEST/212"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: VersionInvalidReportsUnparseableDependencyVersionCase): Promise<FindingSummary> {
        return ManifestFixture.run(new VersionInvalid(), entry);
    }
}
