import assert from "node:assert/strict";
import { test } from "node:test";
import IdentifierInvalidReportsBadEmoteIdentifier from "../Helpers/IdentifierInvalidReportsBadEmoteIdentifier.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of IdentifierInvalidReportsBadEmoteIdentifier.CASES) {
    test(IdentifierInvalidReportsBadEmoteIdentifier.ID + " " + entry.name, async () => {
        const findings = await IdentifierInvalidReportsBadEmoteIdentifier.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
