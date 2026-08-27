import type { CliResult } from "../../Types/Core/CliRunnerTypes.js";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import VanillaLoader from "../../../src/Loaders/VanillaLoader.js";

export default abstract class CliRunner {
    static readonly PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
    static readonly SCENARIOS_ROOT = path.join(CliRunner.PROJECT_ROOT, "tests", "Scenarios");
    static readonly TEXT_EXTENSIONS: readonly string[] = [".json", ".lang", ".mcfunction", ".js", ".txt", ".material"];
    private static readonly CLI_PATH = path.join(CliRunner.PROJECT_ROOT, "dist", "Cli.js");
    private static readonly RESULTS_ROOT = path.join(CliRunner.PROJECT_ROOT, "tests", "Results", "Scenarios");
    private static readonly PINNED_GAME_VERSION = VanillaLoader.sourceGameVersion();
    private static readonly GAME_VERSION_PLACEHOLDER = "__CURRENT_GAME_VERSION__";

    static run(argv: readonly string[], workingDirectory: string = CliRunner.PROJECT_ROOT): CliResult {
        CliRunner.requireBuild();

        const result = spawnSync(process.execPath, [CliRunner.CLI_PATH, ...argv], {
            cwd: workingDirectory,
            encoding: "utf-8",
            env: { ...process.env, SPYGLASS_GAME_VERSION: CliRunner.PINNED_GAME_VERSION, SPYGLASS_SKIP_NPM: "1" },
        });

        return { exitCode: result.status ?? -1, stdout: result.stdout, stderr: result.stderr };
    }

    static scenarioPath(name: string): string {
        return path.join(CliRunner.SCENARIOS_ROOT, name);
    }

    static prepareScenarioInput(name: string, testFolder: string): string {
        const source = path.join(CliRunner.scenarioPath(name), "input");
        const target = path.join(CliRunner.RESULTS_ROOT, testFolder, name);

        fs.rmSync(target, { recursive: true, force: true });
        CliRunner.copyWithVersion(source, target);

        return target;
    }

    private static copyWithVersion(source: string, target: string): void {
        fs.mkdirSync(target, { recursive: true });

        for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
            const from = path.join(source, entry.name);
            const to = path.join(target, entry.name);

            if (entry.isDirectory()) {
                CliRunner.copyWithVersion(from, to);
                continue;
            }

            if (!CliRunner.TEXT_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
                fs.copyFileSync(from, to);
                continue;
            }

            const text = fs.readFileSync(from, "utf-8");

            fs.writeFileSync(to, text.split(CliRunner.GAME_VERSION_PLACEHOLDER).join(CliRunner.PINNED_GAME_VERSION));
        }
    }

    private static requireBuild(): void {
        if (!fs.existsSync(CliRunner.CLI_PATH)) {
            throw new Error("Run npm run build before integration tests. Missing " + CliRunner.CLI_PATH);
        }
    }
}
