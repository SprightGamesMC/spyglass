import type { Finding, ResolvedCheck } from "../../src/Types/CheckTypes.js";
import type { ShapeExpectation } from "../Types/JsonReportKeepsPublishedStructureTypes.js";
import ReportBuilder from "../../src/Cli/ReportBuilder.js";
import JsonReporter from "../../src/Cli/Reporters/JsonReporter.js";

export default abstract class JsonReportKeepsPublishedStructure {
    static readonly SCHEMA_VERSION = ReportBuilder.SCHEMA_VERSION;
    static readonly STARTED_AT = "2026-01-02T03:04:05Z";
    static readonly EXPECTATIONS: readonly ShapeExpectation[] = [
        {
            name: "report",
            keys: [
                "schema_version",
                "tool_version",
                "started_at",
                "input",
                "content_type",
                "layout",
                "passed",
                "counts",
                "counts_by_group",
                "checks",
                "findings",
            ],
        },
        { name: "counts", keys: ["error", "warning", "recommendation"] },
        { name: "check", keys: ["id", "slug", "severity", "skipped", "skip_reason"] },
        { name: "finding", keys: ["id", "slug", "severity", "message", "path", "pack", "location"] },
        { name: "location", keys: ["field", "line"] },
    ];

    static render(findings: readonly Finding[]): Record<string, unknown> {
        const check: ResolvedCheck = {
            definition: { group: "FILE", number: 201, slug: "json-invalid", severity: "error", description: "JSON does not parse" },
            severity: "error",
            skipped: true,
            skipReason: "listed in config",
        };
        const report = ReportBuilder.build(
            "0.0.0",
            JsonReportKeepsPublishedStructure.STARTED_AT,
            "input",
            "addon",
            "standard",
            [check],
            findings,
            "error"
        );

        return JSON.parse(JsonReporter.render(report)) as Record<string, unknown>;
    }

    static fullFinding(): Finding {
        return {
            id: "FILE/201",
            slug: "json-invalid",
            severity: "error",
            message: "JSON does not parse",
            path: "BP/entities/cow.json",
            pack: "BP",
            location: { field: "minecraft:entity", line: 3 },
        };
    }

    static bareFinding(): Finding {
        return { id: "FILE/201", slug: "json-invalid", severity: "error", message: "JSON does not parse" };
    }

    static keysOf(rendered: Record<string, unknown>, name: string): string[] {
        switch (name) {
            case "report":
                return Object.keys(rendered);
            case "counts":
                return Object.keys(rendered.counts as Record<string, unknown>);
            case "check":
                return Object.keys((rendered.checks as Record<string, unknown>[])[0]);
            case "finding":
                return Object.keys((rendered.findings as Record<string, unknown>[])[0]);
            case "location":
                return Object.keys((rendered.findings as Record<string, unknown>[])[0].location as Record<string, unknown>);
            default:
                throw new Error("Unknown structure " + name);
        }
    }
}
