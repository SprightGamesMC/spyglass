import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import PackReferenceNotFoundReportsUnknownPackId from "../Helpers/PackReferenceNotFoundReportsUnknownPackId.js";
import PackReferenceFixture from "../Helpers/World/PackReferenceFixture.js";

for (const entry of PackReferenceNotFoundReportsUnknownPackId.CASES) {
    test(PackReferenceNotFoundReportsUnknownPackId.ID + " " + entry.name, async () => {
        const findings = await PackReferenceNotFoundReportsUnknownPackId.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, PackReferenceNotFoundReportsUnknownPackId.ID);
            assert.equal(finding.path, PackReferenceFixture.PATH);
        }
    });
}
