import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DeprecatedOverrideReportsLegacyTableKey from "../Helpers/DeprecatedOverrideReportsLegacyTableKey.js";

for (const entry of DeprecatedOverrideReportsLegacyTableKey.CASES) {
    test(DeprecatedOverrideReportsLegacyTableKey.ID + " " + entry.name, async () => {
        const findings = await DeprecatedOverrideReportsLegacyTableKey.run(entry.catalog);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedKeys].sort());

        for (const finding of findings) {
            assert.equal(finding.id, DeprecatedOverrideReportsLegacyTableKey.ID);
            assert.equal(finding.path, DeprecatedOverrideReportsLegacyTableKey.CATALOG_PATH);
        }
    });
}
