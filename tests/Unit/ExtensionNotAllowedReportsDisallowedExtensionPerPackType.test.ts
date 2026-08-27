import assert from "node:assert/strict";
import { test } from "node:test";
import ExtensionNotAllowedReportsDisallowedExtensionPerPackType from "../Helpers/ExtensionNotAllowedReportsDisallowedExtensionPerPackType.js";

for (const entry of ExtensionNotAllowedReportsDisallowedExtensionPerPackType.CASES) {
    test(ExtensionNotAllowedReportsDisallowedExtensionPerPackType.ID + " " + entry.name, async () => {
        const findings = await ExtensionNotAllowedReportsDisallowedExtensionPerPackType.run(entry.packType, entry.fileName);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, ExtensionNotAllowedReportsDisallowedExtensionPerPackType.ID);
            assert.equal(findings[0].path, ExtensionNotAllowedReportsDisallowedExtensionPerPackType.ROOT + "/" + entry.fileName);
            assert.equal(findings[0].pack, ExtensionNotAllowedReportsDisallowedExtensionPerPackType.ROOT);
        }
    });
}
