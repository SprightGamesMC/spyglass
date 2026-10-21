import type { ConfigSchema, EnumCase } from "../Types/ConfigSchemaMatchesConfigLoaderTypes.js";
import fs from "node:fs";
import path from "node:path";
import ArgumentParser from "../../src/Cli/ArgumentParser.js";
import ConfigLoader from "../../src/Cli/ConfigLoader.js";
import CliRunner from "./Core/CliRunner.js";

export default abstract class ConfigSchemaMatchesConfigLoader {
    static readonly SCHEMA: ConfigSchema = JSON.parse(
        fs.readFileSync(path.join(CliRunner.PROJECT_ROOT, "schema", "spyglass.config.schema.json"), "utf-8")
    ) as ConfigSchema;
    static readonly ENUM_CASES: readonly EnumCase[] = [
        { key: "contentType", allowed: ArgumentParser.CONTENT_TYPES },
        { key: "layout", allowed: ArgumentParser.LAYOUTS },
        { key: "format", allowed: ArgumentParser.FORMATS },
        { key: "verbosity", allowed: ArgumentParser.VERBOSITIES },
        { key: "failOn", allowed: ArgumentParser.FAIL_ON_LEVELS },
    ];
    static readonly SELECTORS: readonly string[] = [
        "TEXTURE",
        "TEXTURE/401",
        "TEXTURE/401,402,403",
        "TEXTURE/401, 402",
        "TEXTURE/400-499",
        "texture/401",
        "TEXTURE/abc",
        "TEXTURE/",
        "TEXTURE/401-",
    ];
    static readonly SEVERITY_TARGETS: readonly string[] = ["LANG", "DEFINITION/601", "lang", "DEFINITION/60a"];

    static schemaKeys(): string[] {
        return Object.keys(ConfigSchemaMatchesConfigLoader.SCHEMA.properties).sort();
    }

    static loaderKeys(): string[] {
        return [...ConfigLoader.KEYS].sort();
    }

    static schemaEnum(key: string): readonly string[] | undefined {
        return ConfigSchemaMatchesConfigLoader.SCHEMA.properties[key]?.enum;
    }

    static schemaSeverityLevels(): readonly string[] | undefined {
        return ConfigSchemaMatchesConfigLoader.SCHEMA.properties.severity?.additionalProperties?.enum;
    }

    static schemaAcceptsSelector(text: string): boolean {
        return new RegExp(ConfigSchemaMatchesConfigLoader.SCHEMA.definitions.selector.pattern).test(text);
    }

    static loaderAcceptsSelector(text: string): boolean {
        try {
            ArgumentParser.parseSkip(text);

            return true;
        } catch {
            return false;
        }
    }

    static schemaAcceptsSeverityTarget(target: string): boolean {
        const pattern = ConfigSchemaMatchesConfigLoader.SCHEMA.properties.severity?.propertyNames?.pattern ?? "";

        return new RegExp(pattern).test(target);
    }

    static loaderAcceptsSeverityTarget(target: string): boolean {
        try {
            ArgumentParser.parseSeverity(target + "=error");

            return true;
        } catch {
            return false;
        }
    }
}
