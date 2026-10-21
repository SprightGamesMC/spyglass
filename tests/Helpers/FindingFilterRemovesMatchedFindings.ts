import type { Finding, ResolvedCheck } from "../../src/Types/CheckTypes.js";
import type { ConfigIgnore, FilteredFindings } from "../../src/Types/CliTypes.js";
import type { Report } from "../../src/Types/ReportTypes.js";
import type { IgnoreFields } from "../Types/FindingFilterRemovesMatchedFindingsTypes.js";
import ArgumentParser from "../../src/Cli/ArgumentParser.js";
import FindingFilter from "../../src/Cli/FindingFilter.js";
import ReportBuilder from "../../src/Cli/ReportBuilder.js";
import TextReporter from "../../src/Cli/Reporters/TextReporter.js";

export default abstract class FindingFilterRemovesMatchedFindings {
    static readonly REASON = "Texture path is built at run time by scripts";
    static readonly UNUSED_TEXTURE: Finding = {
        id: "PACK/301",
        slug: "asset-unused",
        severity: "warning",
        message: "Texture textures/entity/boss.png is not referenced by any definition",
        path: "RP/textures/entity/boss.png",
        pack: "RP",
    };
    static readonly INVALID_JSON: Finding = {
        id: "FILE/201",
        slug: "json-invalid",
        severity: "error",
        message: "JSON does not parse",
        path: "BP/entities/cow.json",
        pack: "BP",
        location: { field: "minecraft:entity" },
    };
    static readonly PACK_WITHOUT_PATH: Finding = { id: "PACK/301", slug: "asset-unused", severity: "warning", message: "No path" };
    private static readonly CHECKS: readonly ResolvedCheck[] = [
        {
            definition: { group: "PACK", number: 301, slug: "asset-unused", severity: "warning", description: "a" },
            severity: "warning",
            skipped: false,
        },
        {
            definition: { group: "FILE", number: 201, slug: "json-invalid", severity: "error", description: "b" },
            severity: "error",
            skipped: false,
        },
        {
            definition: { group: "SKIN", number: 101, slug: "skins-json-missing", severity: "error", description: "c" },
            severity: "error",
            skipped: true,
            skipReason: "group not selected for content type",
        },
    ];

    static ignore(id: string, fields: IgnoreFields = {}): ConfigIgnore {
        return { id, selector: ArgumentParser.parseSkip(id), reason: FindingFilterRemovesMatchedFindings.REASON, ...fields };
    }

    static apply(findings: readonly Finding[], ignores: readonly ConfigIgnore[]): FilteredFindings {
        return FindingFilter.apply(findings, ignores, FindingFilterRemovesMatchedFindings.CHECKS);
    }

    static report(findings: readonly Finding[], ignores: readonly ConfigIgnore[]): Report {
        const filtered = FindingFilterRemovesMatchedFindings.apply(findings, ignores);

        return ReportBuilder.build(
            "0.0.0",
            "2026-01-02T03:04:05Z",
            "input",
            "addon",
            "standard",
            FindingFilterRemovesMatchedFindings.CHECKS,
            filtered.kept,
            filtered.ignored,
            "error"
        );
    }

    static summaryLine(report: Report): string {
        return TextReporter.renderSummary(report, 0, false).split("\n")[1];
    }
}
