import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleManifestsReportsNestedManifestInPack from "../Helpers/MultipleManifestsReportsNestedManifestInPack.js";

for (const entry of MultipleManifestsReportsNestedManifestInPack.CASES) {
    test(MultipleManifestsReportsNestedManifestInPack.ID + " " + entry.name, async () => {
        const findings = await MultipleManifestsReportsNestedManifestInPack.run(entry.files);

        assert.deepEqual(findings.map((finding) => finding.pack).sort(), [...entry.expectedPacks].sort());
        assert.ok(findings.every((finding) => finding.id === MultipleManifestsReportsNestedManifestInPack.ID));
    });
}
