import type { CliResult } from "../Types/Core/CliRunnerTypes.js";
import type { ExitCodeCase } from "../Types/CliExitCodesMatchDocumentationTypes.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import CliRunner from "./Core/CliRunner.js";

export default abstract class CliExitCodesMatchDocumentation {
    static readonly CASES: readonly ExitCodeCase[] = [
        {
            name: "help prints usage and exits 0 because help is not a validation run",
            arguments: ["--help"],
            exitCode: 0,
            stdoutIncludes: "Usage: spyglass",
        },
        { name: "version prints and exits 0 because version is not a validation run", arguments: ["--version"], exitCode: 0 },
        {
            name: "list rules without a content type lists every check and exits 0",
            arguments: ["--list-rules"],
            exitCode: 0,
            stdoutIncludes: "FILE/201",
        },
        {
            name: "list rules with skip FILE marks the FILE checks as skipped by --skip",
            arguments: ["addon", "--list-rules", "--skip", "FILE"],
            exitCode: 0,
            stdoutIncludes: "skipped by --skip",
        },
        {
            name: "content type mod is not a known content type so it is a usage error",
            arguments: ["mod"],
            exitCode: 2,
            stderrIncludes: "Usage error",
        },
        {
            name: "input without a content type is a usage error because content type is required",
            arguments: ["--input", "."],
            exitCode: 2,
            stderrIncludes: "Content type is required",
        },
        { name: "option --unknown is not a known option so it is a usage error", arguments: ["addon", "--unknown"], exitCode: 2 },
        {
            name: "skip FILE/999 gives an unknown check ID so it is a usage error",
            arguments: ["addon", "--skip", "FILE/999"],
            exitCode: 2,
            stderrIncludes: "Unknown check ID",
        },
        {
            name: "input path that does not exist is a usage error",
            arguments: ["addon", "--input", "./does-not-exist-anywhere"],
            exitCode: 2,
            stderrIncludes: "does not exist",
        },
        {
            name: "config path that does not exist is a usage error",
            arguments: ["addon", "--config", "./missing.config.json"],
            exitCode: 2,
        },
    ];

    static run(entry: ExitCodeCase): CliResult {
        return CliRunner.run(entry.arguments);
    }

    static runOnBrokenJsonFolder(argv: readonly string[]): CliResult {
        const folder = fs.mkdtempSync(path.join(os.tmpdir(), "spyglass-invalid-json-"));

        fs.mkdirSync(path.join(folder, "BP"));
        fs.writeFileSync(path.join(folder, "BP", "manifest.json"), "{ not json");

        try {
            return CliRunner.run([...argv, "--input", folder]);
        } finally {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    }

    static runOnBrokenArchive(): CliResult {
        const folder = fs.mkdtempSync(path.join(os.tmpdir(), "spyglass-invalid-archive-"));
        const archive = path.join(folder, "invalid.mcaddon");

        fs.writeFileSync(archive, "this is not a zip");

        try {
            return CliRunner.run(["addon", "--input", archive]);
        } finally {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    }
}
