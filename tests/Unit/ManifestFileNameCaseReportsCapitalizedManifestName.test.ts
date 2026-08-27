import assert from "node:assert/strict";
import { test } from "node:test";
import ManifestFileNameCaseReportsCapitalizedManifestName from "../Helpers/ManifestFileNameCaseReportsCapitalizedManifestName.js";

for (const entry of ManifestFileNameCaseReportsCapitalizedManifestName.CASES) {
    test(ManifestFileNameCaseReportsCapitalizedManifestName.ID + " " + entry.name, async () => {
        const result = await ManifestFileNameCaseReportsCapitalizedManifestName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
