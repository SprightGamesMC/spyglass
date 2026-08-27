import assert from "node:assert/strict";
import { test } from "node:test";
import CheckRegistryMatchesChecksDoc from "../Helpers/CheckRegistryMatchesChecksDoc.js";

test("docs/checks pages list every registered check with the same slug, severity, and description", () => {
    const differences = CheckRegistryMatchesChecksDoc.differences();

    assert.deepEqual(differences, []);
});

test("docs/checks pages have more than 250 rows to compare", () => {
    assert.ok(CheckRegistryMatchesChecksDoc.documented().length > 250);
});
