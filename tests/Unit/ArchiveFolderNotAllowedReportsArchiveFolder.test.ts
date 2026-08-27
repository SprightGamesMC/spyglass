import assert from "node:assert/strict";
import { test } from "node:test";
import ArchiveFolderNotAllowedReportsArchiveFolder from "../Helpers/ArchiveFolderNotAllowedReportsArchiveFolder.js";

for (const entry of ArchiveFolderNotAllowedReportsArchiveFolder.CASES) {
    test(ArchiveFolderNotAllowedReportsArchiveFolder.ID + " " + entry.name, async () => {
        const result = await ArchiveFolderNotAllowedReportsArchiveFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
