import assert from "node:assert/strict";
import { test } from "node:test";
import FileNameInvalidReportsUnexpectedArtName from "../Helpers/FileNameInvalidReportsUnexpectedArtName.js";

for (const entry of FileNameInvalidReportsUnexpectedArtName.CASES) {
    test(FileNameInvalidReportsUnexpectedArtName.ID + " " + entry.name, async () => {
        const result = await FileNameInvalidReportsUnexpectedArtName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
