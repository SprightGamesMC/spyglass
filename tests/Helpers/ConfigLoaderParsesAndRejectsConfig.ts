import type { ConfigFile } from "../../src/Types/CliTypes.js";
import type { ConfigCase, ResolvedConfigPaths } from "../Types/ConfigLoaderParsesAndRejectsConfigTypes.js";
import path from "node:path";
import ConfigLoader from "../../src/Cli/ConfigLoader.js";

export default abstract class ConfigLoaderParsesAndRejectsConfig {
    static readonly CASES: readonly ConfigCase[] = [
        { name: "empty object is a valid config with no fields", value: {}, valid: true },
        { name: "skip strings TEXTURE and FILE/401 are valid selectors", value: { skip: ["TEXTURE", "FILE/401"] }, valid: true },
        {
            name: "skip object with id CHUNK and reason slow is a valid selector",
            value: { skip: [{ id: "CHUNK", reason: "slow" }] },
            valid: true,
        },
        {
            name: "severity map with DEFINITION/601 error and FILE warning has valid levels",
            value: { severity: { "DEFINITION/601": "error", FILE: "warning" } },
            valid: true,
        },
        { name: "failOn warning is a valid fail level", value: { failOn: "warning" }, valid: true },
        { name: "array root is not a config object", value: [], valid: false },
        { name: "skip file/1 is not an upper case selector", value: { skip: ["file/1"] }, valid: false },
        { name: "severity fatal is not a known level", value: { severity: { "DEFINITION/601": "fatal" } }, valid: false },
        { name: "failOn always is not a known fail level", value: { failOn: "always" }, valid: false },
        {
            name: "ignore entry with id PACK/301, path, and reason is valid",
            value: { ignore: [{ id: "PACK/301", path: "RP/textures/a.png", reason: "named by a script" }] },
            valid: true,
        },
        { name: "ignore entry without a reason is rejected", value: { ignore: [{ id: "PACK/301" }] }, valid: false },
        { name: "ignore entry with an empty reason is rejected", value: { ignore: [{ id: "PACK/301", reason: " " }] }, valid: false },
        {
            name: "ignore entry with the unknown field paths is rejected",
            value: { ignore: [{ id: "PACK/301", paths: "RP/a.png", reason: "named by a script" }] },
            valid: false,
        },
        { name: "ignore entry that is a string is not an object", value: { ignore: ["PACK/301"] }, valid: false },
        { name: "ignore that is an object is not an array", value: { ignore: { id: "PACK/301" } }, valid: false },
        {
            name: "ignore path that is a number is not a string",
            value: { ignore: [{ id: "PACK/301", path: 3, reason: "named by a script" }] },
            valid: false,
        },
        {
            name: "contentType addon, input, layout marketplace, output, format json, verbosity verbose, and noColor true are valid",
            value: {
                contentType: "addon",
                input: "build",
                layout: "marketplace",
                output: "reports",
                format: "json",
                verbosity: "verbose",
                noColor: true,
            },
            valid: true,
        },
        { name: "contentType mod is not a known content type", value: { contentType: "mod" }, valid: false },
        { name: "input that is a number is not a string", value: { input: 3 }, valid: false },
        { name: "layout grid is not a known layout", value: { layout: "grid" }, valid: false },
        { name: "output that is an array is not a string", value: { output: ["reports"] }, valid: false },
        { name: "format xml is not a known format", value: { format: "xml" }, valid: false },
        { name: "verbosity loud is not a known verbosity", value: { verbosity: "loud" }, valid: false },
        { name: "noColor that is the string true is not a boolean", value: { noColor: "true" }, valid: false },
        { name: "$schema key is allowed so an editor can load the schema", value: { $schema: "schema.json" }, valid: true },
        { name: "failon is an unknown key because keys are case sensitive", value: { failon: "warning" }, valid: false },
    ];

    static parse(value: unknown, source = "test"): ConfigFile | undefined {
        try {
            return ConfigLoader.fromValue(value, source);
        } catch {
            return undefined;
        }
    }

    static resolvedPaths(): ResolvedConfigPaths {
        const parsed = ConfigLoaderParsesAndRejectsConfig.parse(
            { input: "build", output: "reports" },
            path.join("sub", "spyglass.config.json")
        );

        return {
            input: parsed?.input,
            output: parsed?.output,
            expectedInput: path.resolve("sub", "build"),
            expectedOutput: path.resolve("sub", "reports"),
        };
    }
}
