import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackScopeInvalidReportsUnknownScopeCase } from "../Types/PackScopeInvalidReportsUnknownScopeTypes.js";
import PackScopeInvalid from "../../src/Checks/Manifest/PackScopeInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PackScopeInvalidReportsUnknownScope {
    static readonly ID = "MANIFEST/204";
    static readonly CASES: readonly PackScopeInvalidReportsUnknownScopeCase[] = [
        {
            name: "pack_scope world is a known scope",
            files: { "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest(), { pack_scope: "world" }) },
            expectedIds: [],
        },
        {
            name: "pack_scope everywhere is not global world or any",
            files: { "BP/manifest.json": ManifestFixture.withHeader(ModelFixture.behaviorManifest(), { pack_scope: "everywhere" }) },
            expectedIds: ["MANIFEST/204"],
        },
    ];

    static async run(entry: PackScopeInvalidReportsUnknownScopeCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PackScopeInvalid(), entry);
    }
}
