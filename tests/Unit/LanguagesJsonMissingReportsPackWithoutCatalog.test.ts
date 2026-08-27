import assert from "node:assert/strict";
import { test } from "node:test";
import LanguagesJsonMissingReportsPackWithoutCatalog from "../Helpers/LanguagesJsonMissingReportsPackWithoutCatalog.js";

for (const entry of LanguagesJsonMissingReportsPackWithoutCatalog.CASES) {
    test(LanguagesJsonMissingReportsPackWithoutCatalog.ID + " " + entry.name, async () => {
        const findings = await LanguagesJsonMissingReportsPackWithoutCatalog.run(entry);

        assert.deepEqual(
            findings.map((finding) => finding.pack),
            [...entry.expectedPacks]
        );

        for (const finding of findings) {
            assert.equal(finding.id, LanguagesJsonMissingReportsPackWithoutCatalog.ID);
            assert.equal(finding.path, undefined);
        }
    });
}
