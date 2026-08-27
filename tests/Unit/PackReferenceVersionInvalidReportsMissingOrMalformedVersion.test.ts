import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import PackReferenceVersionInvalidReportsMissingOrMalformedVersion from "../Helpers/PackReferenceVersionInvalidReportsMissingOrMalformedVersion.js";
import PackReferenceFixture from "../Helpers/World/PackReferenceFixture.js";

for (const entry of PackReferenceVersionInvalidReportsMissingOrMalformedVersion.CASES) {
    test(PackReferenceVersionInvalidReportsMissingOrMalformedVersion.ID + " " + entry.name, async () => {
        const findings = await PackReferenceVersionInvalidReportsMissingOrMalformedVersion.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, PackReferenceVersionInvalidReportsMissingOrMalformedVersion.ID);
            assert.equal(finding.path, PackReferenceFixture.PATH);
        }
    });
}
