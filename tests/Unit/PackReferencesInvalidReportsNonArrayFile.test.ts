import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import PackReferencesInvalidReportsNonArrayFile from "../Helpers/PackReferencesInvalidReportsNonArrayFile.js";
import PackReferenceFixture from "../Helpers/World/PackReferenceFixture.js";

for (const entry of PackReferencesInvalidReportsNonArrayFile.CASES) {
    test(PackReferencesInvalidReportsNonArrayFile.ID + " " + entry.name, async () => {
        const findings = await PackReferencesInvalidReportsNonArrayFile.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, PackReferencesInvalidReportsNonArrayFile.ID);
            assert.equal(finding.path, PackReferenceFixture.PATH);
        }
    });
}
