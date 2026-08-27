import assert from "node:assert/strict";
import { test } from "node:test";
import UnknownJsonReportsUnclassifiedJsonFile from "../Helpers/UnknownJsonReportsUnclassifiedJsonFile.js";

for (const entry of UnknownJsonReportsUnclassifiedJsonFile.CASES) {
    test(UnknownJsonReportsUnclassifiedJsonFile.ID + " " + entry.name, async () => {
        const findings = await UnknownJsonReportsUnclassifiedJsonFile.run(entry.packPath, entry.packType);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, UnknownJsonReportsUnclassifiedJsonFile.ID);
            assert.equal(findings[0].path, "BP/" + entry.packPath);
            assert.equal(findings[0].pack, "BP");
        }
    });
}
