import type { ReportFileCase } from "../Types/ReportFileEndsWithSummaryTypes.js";
import fs from "node:fs";
import path from "node:path";
import CliRunner from "./Core/CliRunner.js";

export default abstract class ReportFileEndsWithSummary {
    static readonly SCENARIO = "addon-standard";
    private static readonly TEST_FOLDER = "ReportFileEndsWithSummary";
    static readonly CASES: readonly ReportFileCase[] = [
        {
            name: "a text report file ends with the summary so a saved report contains the counts and the verdict",
            format: "text",
            fileName: "spyglass.report.txt",
            endsWithSummary: true,
        },
        {
            name: "a json report file has no summary block because counts and passed are already fields",
            format: "json",
            fileName: "spyglass.report.json",
            endsWithSummary: false,
        },
        {
            name: "a csv report file has no summary block because a row per finding has no place for one",
            format: "csv",
            fileName: "spyglass.report.csv",
            endsWithSummary: false,
        },
    ];
    private static readonly OUTPUT_ROOT = path.join(CliRunner.PROJECT_ROOT, "tests", "Results", "ReportFiles");

    static write(entry: ReportFileCase): string {
        const inputPath = CliRunner.prepareScenarioInput(ReportFileEndsWithSummary.SCENARIO, ReportFileEndsWithSummary.TEST_FOLDER);
        const outputPath = path.join(ReportFileEndsWithSummary.OUTPUT_ROOT, entry.format);

        fs.rmSync(outputPath, { recursive: true, force: true });

        const result = CliRunner.run(["addon", "--input", inputPath, "--format", entry.format, "--output", outputPath]);

        if (result.exitCode !== 0 && result.exitCode !== 1) {
            throw new Error("Report run exited " + result.exitCode + ": " + result.stderr);
        }

        return fs.readFileSync(path.join(outputPath, entry.fileName), "utf-8");
    }

    static lastLine(text: string): string {
        const lines = text.trimEnd().split("\n");

        return lines[lines.length - 1];
    }
}
