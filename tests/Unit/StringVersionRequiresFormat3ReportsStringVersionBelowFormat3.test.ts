import assert from "node:assert/strict";
import { test } from "node:test";
import StringVersionRequiresFormat3ReportsStringVersionBelowFormat3 from "../Helpers/StringVersionRequiresFormat3ReportsStringVersionBelowFormat3.js";

for (const entry of StringVersionRequiresFormat3ReportsStringVersionBelowFormat3.CASES) {
    test(StringVersionRequiresFormat3ReportsStringVersionBelowFormat3.ID + " " + entry.name, async () => {
        const result = await StringVersionRequiresFormat3ReportsStringVersionBelowFormat3.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
