import assert from "node:assert/strict";
import { test } from "node:test";
import IdentifierFormInvalidReportsWrongPrefix from "../Helpers/IdentifierFormInvalidReportsWrongPrefix.js";

for (const entry of IdentifierFormInvalidReportsWrongPrefix.CASES) {
    test(IdentifierFormInvalidReportsWrongPrefix.ID + " " + entry.name, async () => {
        const found = await IdentifierFormInvalidReportsWrongPrefix.run(entry);

        assert.deepEqual(found, entry.expectedFields);
    });
}
