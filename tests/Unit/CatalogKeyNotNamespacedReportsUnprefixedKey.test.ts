import assert from "node:assert/strict";
import { test } from "node:test";
import CatalogKeyNotNamespacedReportsUnprefixedKey from "../Helpers/CatalogKeyNotNamespacedReportsUnprefixedKey.js";

for (const entry of CatalogKeyNotNamespacedReportsUnprefixedKey.CASES) {
    test(CatalogKeyNotNamespacedReportsUnprefixedKey.ID + " " + entry.name, async () => {
        const fields = await CatalogKeyNotNamespacedReportsUnprefixedKey.run(entry);

        assert.deepEqual(fields, entry.expectedFields);
    });
}
