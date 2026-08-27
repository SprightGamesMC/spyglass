import type { ConfigFile } from "../../src/Types/CliTypes.js";
import type { ConfigCase } from "../Types/ConfigLoaderParsesAndRejectsConfigTypes.js";
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
    ];

    static parse(value: unknown): ConfigFile | undefined {
        try {
            return ConfigLoader.fromValue(value, "test");
        } catch {
            return undefined;
        }
    }
}
