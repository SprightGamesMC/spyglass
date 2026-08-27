import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import PackReferenceIdInvalidReportsMissingOrMalformedPackId from "../Helpers/PackReferenceIdInvalidReportsMissingOrMalformedPackId.js";
import PackReferenceFixture from "../Helpers/World/PackReferenceFixture.js";

for (const entry of PackReferenceIdInvalidReportsMissingOrMalformedPackId.CASES) {
    test(PackReferenceIdInvalidReportsMissingOrMalformedPackId.ID + " " + entry.name, async () => {
        const findings = await PackReferenceIdInvalidReportsMissingOrMalformedPackId.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, PackReferenceIdInvalidReportsMissingOrMalformedPackId.ID);
            assert.equal(finding.path, PackReferenceFixture.PATH);
        }
    });
}
