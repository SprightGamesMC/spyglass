import assert from "node:assert/strict";
import { test } from "node:test";
import ManifestMissingReportsPackFolderWithoutManifest from "../Helpers/ManifestMissingReportsPackFolderWithoutManifest.js";

for (const entry of ManifestMissingReportsPackFolderWithoutManifest.CASES) {
    test(ManifestMissingReportsPackFolderWithoutManifest.ID + " " + entry.name, async () => {
        const result = await ManifestMissingReportsPackFolderWithoutManifest.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
