import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { DependencyIdentifierAmbiguousReportsModuleNameWithUuidCase } from "../Types/DependencyIdentifierAmbiguousReportsModuleNameWithUuidTypes.js";
import DependencyIdentifierAmbiguous from "../../src/Checks/Manifest/DependencyIdentifierAmbiguous.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class DependencyIdentifierAmbiguousReportsModuleNameWithUuid {
    static readonly ID = "MANIFEST/210";
    static readonly CASES: readonly DependencyIdentifierAmbiguousReportsModuleNameWithUuidCase[] = [
        {
            name: "module_name and uuid dependencies each have one identifier",
            files: ManifestFixture.behaviorWithDependencies(ManifestFixture.VALID_DEPENDENCIES),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dependency with module_name and uuid has two identifiers",
            files: ManifestFixture.behaviorWithDependencies([
                { module_name: "@minecraft/server", uuid: ManifestFixture.PACK_UUID, version: "1.2.0" },
            ]),
            expectedIds: ["MANIFEST/210"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: DependencyIdentifierAmbiguousReportsModuleNameWithUuidCase): Promise<FindingSummary> {
        return ManifestFixture.run(new DependencyIdentifierAmbiguous(), entry);
    }
}
