import assert from "node:assert/strict";
import { test } from "node:test";
import DefinitionIdentifierNotNamespacedReportsVanillaNamespace from "../Helpers/DefinitionIdentifierNotNamespacedReportsVanillaNamespace.js";

for (const entry of DefinitionIdentifierNotNamespacedReportsVanillaNamespace.CASES) {
    test(DefinitionIdentifierNotNamespacedReportsVanillaNamespace.ID + " " + entry.name, async () => {
        const fields = await DefinitionIdentifierNotNamespacedReportsVanillaNamespace.run(entry);

        assert.deepEqual(fields, entry.expectedFields);
    });
}
