import assert from "node:assert/strict";
import { test } from "node:test";
import ChatHighlightInvalidReportsMissingOrOddAmpersand from "../Helpers/ChatHighlightInvalidReportsMissingOrOddAmpersand.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of ChatHighlightInvalidReportsMissingOrOddAmpersand.CASES) {
    test(ChatHighlightInvalidReportsMissingOrOddAmpersand.ID + " " + entry.name, async () => {
        const findings = await ChatHighlightInvalidReportsMissingOrOddAmpersand.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
