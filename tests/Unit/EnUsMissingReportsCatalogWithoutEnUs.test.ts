import assert from "node:assert/strict";
import { test } from "node:test";
import EnUsMissingReportsCatalogWithoutEnUs from "../Helpers/EnUsMissingReportsCatalogWithoutEnUs.js";

for (const entry of EnUsMissingReportsCatalogWithoutEnUs.CASES) {
    test(EnUsMissingReportsCatalogWithoutEnUs.ID + " " + entry.name, async () => {
        const result = await EnUsMissingReportsCatalogWithoutEnUs.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
