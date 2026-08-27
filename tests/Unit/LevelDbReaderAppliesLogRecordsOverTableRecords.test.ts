import assert from "node:assert/strict";
import { test } from "node:test";
import LevelDbReaderAppliesLogRecordsOverTableRecords from "../Helpers/LevelDbReaderAppliesLogRecordsOverTableRecords.js";

for (const entry of LevelDbReaderAppliesLogRecordsOverTableRecords.CASES) {
    test(entry.name, () => {
        const records = LevelDbReaderAppliesLogRecordsOverTableRecords.run(entry);

        assert.deepEqual(records, entry.expected);
    });
}
