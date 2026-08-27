import assert from "node:assert/strict";
import { test } from "node:test";
import ProductTypeMissingReportsManifestWithoutAddonProductType from "../Helpers/ProductTypeMissingReportsManifestWithoutAddonProductType.js";

for (const entry of ProductTypeMissingReportsManifestWithoutAddonProductType.CASES) {
    test(ProductTypeMissingReportsManifestWithoutAddonProductType.ID + " " + entry.name, async () => {
        const result = await ProductTypeMissingReportsManifestWithoutAddonProductType.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
