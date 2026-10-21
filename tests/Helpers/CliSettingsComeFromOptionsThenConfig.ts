import type { SettingsRun } from "../Types/CliSettingsComeFromOptionsThenConfigTypes.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import CliRunner from "./Core/CliRunner.js";

export default abstract class CliSettingsComeFromOptionsThenConfig {
    private static readonly CONFIG = { contentType: "addon", input: "content", layout: "standard", format: "json" };

    static run(argv: readonly string[]): SettingsRun {
        const folder = fs.mkdtempSync(path.join(os.tmpdir(), "spyglass-config-settings-"));
        const content = path.join(folder, "content");

        fs.mkdirSync(path.join(content, "BP"), { recursive: true });
        fs.writeFileSync(path.join(content, "BP", "manifest.json"), "{ not json");
        fs.writeFileSync(path.join(folder, "spyglass.config.json"), JSON.stringify(CliSettingsComeFromOptionsThenConfig.CONFIG));

        try {
            const result = CliRunner.run(argv, folder);
            const report = result.stdout.trim() === "" ? {} : (JSON.parse(result.stdout) as Record<string, unknown>);

            return {
                exitCode: result.exitCode,
                stderr: result.stderr,
                contentType: report.content_type as string | undefined,
                layout: report.layout as string | undefined,
                inputFolderName: typeof report.input === "string" ? path.basename(report.input) : undefined,
            };
        } finally {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    }
}
