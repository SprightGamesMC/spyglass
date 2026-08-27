import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import CatalogResourceUnusedReportsUndefinedBlock from "../Helpers/CatalogResourceUnusedReportsUndefinedBlock.js";

for (const entry of CatalogResourceUnusedReportsUndefinedBlock.CASES) {
    test(CatalogResourceUnusedReportsUndefinedBlock.ID + " " + entry.name, async () => {
        const findings = await CatalogResourceUnusedReportsUndefinedBlock.run(entry);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedKeys].sort());

        for (const finding of findings) {
            assert.equal(finding.id, CatalogResourceUnusedReportsUndefinedBlock.ID);
            assert.equal(finding.path, CatalogResourceUnusedReportsUndefinedBlock.CATALOG_PATH);
            assert.equal(finding.pack, "RP");
        }
    });
}
