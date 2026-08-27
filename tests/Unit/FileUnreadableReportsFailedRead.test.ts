import assert from "node:assert/strict";
import { test } from "node:test";
import FileUnreadableReportsFailedRead from "../Helpers/FileUnreadableReportsFailedRead.js";

for (const entry of FileUnreadableReportsFailedRead.CASES) {
    test(FileUnreadableReportsFailedRead.ID + " " + entry.name, async () => {
        const result = await FileUnreadableReportsFailedRead.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
