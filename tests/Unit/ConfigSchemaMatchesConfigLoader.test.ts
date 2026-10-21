import assert from "node:assert/strict";
import { test } from "node:test";
import ConfigSchemaMatchesConfigLoader from "../Helpers/ConfigSchemaMatchesConfigLoader.js";

test("schema properties are the keys the config loader accepts so no key is missing from either", () => {
    assert.deepEqual(ConfigSchemaMatchesConfigLoader.schemaKeys(), ConfigSchemaMatchesConfigLoader.loaderKeys());
});

for (const entry of ConfigSchemaMatchesConfigLoader.ENUM_CASES) {
    test("schema " + entry.key + " values are the values the config loader accepts", () => {
        assert.deepEqual(ConfigSchemaMatchesConfigLoader.schemaEnum(entry.key), entry.allowed);
    });
}

test("schema severity levels are error, warning, and recommendation as the config loader accepts", () => {
    assert.deepEqual(ConfigSchemaMatchesConfigLoader.schemaSeverityLevels(), ["error", "warning", "recommendation"]);
});

for (const text of ConfigSchemaMatchesConfigLoader.SELECTORS) {
    test("selector " + text + " is accepted by the schema only when the config loader accepts it", () => {
        assert.equal(
            ConfigSchemaMatchesConfigLoader.schemaAcceptsSelector(text),
            ConfigSchemaMatchesConfigLoader.loaderAcceptsSelector(text)
        );
    });
}

for (const target of ConfigSchemaMatchesConfigLoader.SEVERITY_TARGETS) {
    test("severity target " + target + " is accepted by the schema only when the config loader accepts it", () => {
        assert.equal(
            ConfigSchemaMatchesConfigLoader.schemaAcceptsSeverityTarget(target),
            ConfigSchemaMatchesConfigLoader.loaderAcceptsSeverityTarget(target)
        );
    });
}
