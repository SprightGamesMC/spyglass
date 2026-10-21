import assert from "node:assert/strict";
import { test } from "node:test";
import CliSettingsComeFromOptionsThenConfig from "../Helpers/CliSettingsComeFromOptionsThenConfig.js";

test("check with contentType addon and input content in the config validates content as an addon", () => {
    const result = CliSettingsComeFromOptionsThenConfig.run(["check"]);

    assert.equal(result.exitCode, 1, result.stderr);
    assert.equal(result.contentType, "addon");
    assert.equal(result.layout, "standard");
    assert.equal(result.inputFolderName, "content");
});

test("check world overrides contentType addon from the config because the command line comes first", () => {
    const result = CliSettingsComeFromOptionsThenConfig.run(["check", "world"]);

    assert.equal(result.contentType, "world", result.stderr);
});

test("layout marketplace on the command line overrides layout standard from the config", () => {
    const result = CliSettingsComeFromOptionsThenConfig.run(["check", "--layout", "marketplace"]);

    assert.equal(result.layout, "marketplace", result.stderr);
});
