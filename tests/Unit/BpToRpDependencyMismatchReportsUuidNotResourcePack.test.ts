import assert from "node:assert/strict";
import { test } from "node:test";
import BpToRpDependencyMismatchReportsUuidNotResourcePack from "../Helpers/BpToRpDependencyMismatchReportsUuidNotResourcePack.js";

for (const entry of BpToRpDependencyMismatchReportsUuidNotResourcePack.CASES) {
    test(BpToRpDependencyMismatchReportsUuidNotResourcePack.ID + " " + entry.name, async () => {
        const result = await BpToRpDependencyMismatchReportsUuidNotResourcePack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.fields, entry.expectedFields);
    });
}
