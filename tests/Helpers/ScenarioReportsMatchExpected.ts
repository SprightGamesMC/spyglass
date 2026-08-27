import type { ScenarioComparison, ScenarioDefinition, ScenarioReport } from "../Types/ScenarioReportsMatchExpectedTypes.js";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import CliRunner from "./Core/CliRunner.js";

export default abstract class ScenarioReportsMatchExpected {
    private static readonly UPDATE_ENVIRONMENT = "SPYGLASS_UPDATE_SCENARIOS";
    private static readonly TEST_FOLDER = "ScenarioReportsMatchExpected";
    private static readonly EXPECTED_FILE = "expected.json";
    private static readonly ARGUMENTS_FILE = "arguments.json";

    static list(): ScenarioDefinition[] {
        if (!fs.existsSync(CliRunner.SCENARIOS_ROOT)) {
            return [];
        }

        return fs
            .readdirSync(CliRunner.SCENARIOS_ROOT, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => ({ name: entry.name, arguments: ScenarioReportsMatchExpected.readArguments(entry.name) }))
            .sort((left, right) => left.name.localeCompare(right.name));
    }

    static compare(scenario: ScenarioDefinition): ScenarioComparison {
        const folder = CliRunner.scenarioPath(scenario.name);
        const inputPath = CliRunner.prepareScenarioInput(scenario.name, ScenarioReportsMatchExpected.TEST_FOLDER);
        const result = CliRunner.run([...scenario.arguments, "--input", inputPath, "--format", "json"]);

        if (result.exitCode !== 0 && result.exitCode !== 1) {
            throw new Error("Scenario " + scenario.name + " exited " + result.exitCode + ": " + result.stderr);
        }

        const actual = ScenarioReportsMatchExpected.strip(JSON.parse(result.stdout) as Record<string, unknown>);
        const expectedPath = path.join(folder, ScenarioReportsMatchExpected.EXPECTED_FILE);
        const update = process.env[ScenarioReportsMatchExpected.UPDATE_ENVIRONMENT] !== undefined;

        if (update) {
            fs.writeFileSync(expectedPath, JSON.stringify({ exit_code: result.exitCode, ...actual }, null, 2) + "\n");
        }

        const expected = fs.existsSync(expectedPath)
            ? (JSON.parse(fs.readFileSync(expectedPath, "utf-8")) as Record<string, unknown>)
            : undefined;

        return {
            name: scenario.name,
            exitCode: result.exitCode,
            actual,
            expected: expected === undefined ? undefined : ScenarioReportsMatchExpected.strip(expected),
            updated: update,
        };
    }

    static expectedExitCode(scenario: ScenarioDefinition): number | undefined {
        const expectedPath = path.join(CliRunner.scenarioPath(scenario.name), ScenarioReportsMatchExpected.EXPECTED_FILE);

        if (!fs.existsSync(expectedPath)) {
            return undefined;
        }

        const parsed = JSON.parse(fs.readFileSync(expectedPath, "utf-8")) as Record<string, unknown>;

        return typeof parsed.exit_code === "number" ? parsed.exit_code : undefined;
    }

    private static readArguments(name: string): string[] {
        const file = path.join(CliRunner.scenarioPath(name), ScenarioReportsMatchExpected.ARGUMENTS_FILE);

        return JSON.parse(fs.readFileSync(file, "utf-8")) as string[];
    }

    private static strip(report: Record<string, unknown>): ScenarioReport {
        const findings = (report.findings as Record<string, unknown>[]).map((finding) => {
            const copy = { ...finding };

            delete copy.message;

            return copy;
        });

        return {
            content_type: String(report.content_type),
            layout: String(report.layout),
            passed: Boolean(report.passed),
            counts: report.counts as Record<string, number>,
            findings,
        };
    }
}
