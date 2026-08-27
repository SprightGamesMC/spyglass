import assert from "node:assert/strict";
import { test } from "node:test";
import FileNameBlockedReportsReservedGameFile from "../Helpers/FileNameBlockedReportsReservedGameFile.js";

for (const entry of FileNameBlockedReportsReservedGameFile.CASES) {
    test(FileNameBlockedReportsReservedGameFile.ID + " " + entry.name, async () => {
        const findings = await FileNameBlockedReportsReservedGameFile.run(entry.packType, entry.packPath);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, FileNameBlockedReportsReservedGameFile.ID);
            assert.equal(findings[0].path, FileNameBlockedReportsReservedGameFile.ROOT + "/" + entry.packPath);
        }
    });
}
