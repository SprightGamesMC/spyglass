import type { ConventionViolation, SourceFile, VersionPair } from "../Types/CodeConventionsApplyAcrossSourceAndTestsTypes.js";
import fs from "node:fs";
import path from "node:path";
import VanillaLoader from "../../src/Loaders/VanillaLoader.js";
import Main from "../../src/Main.js";
import CliRunner from "./Core/CliRunner.js";

export default abstract class CodeConventionsApplyAcrossSourceAndTests {
    private static readonly FOLDERS: readonly string[] = ["src", "tests", "scripts"];
    private static readonly COMMENT_FREE_FOLDERS: readonly string[] = ["src", "tests"];
    private static readonly SKIPPED_FOLDERS: readonly string[] = ["tests/Scenarios", "tests/Results"];
    private static readonly TEST_FOLDERS: readonly string[] = ["tests/Unit", "tests/Integration"];
    private static readonly SCENARIOS_FOLDER = "tests/Scenarios";
    private static readonly DEFAULT_CLASS_PATTERN = /^export default (?:abstract )?class ([A-Za-z0-9]+)/m;
    private static readonly CLASS_PATTERN = /^\s*(?:export default )?(?:abstract )?class [A-Za-z0-9]+/gm;
    private static readonly TYPE_DECLARATION_PATTERN = /^\s*(?:export )?(?:interface [A-Z]|enum [A-Z]|type [A-Z][A-Za-z0-9]* =)/;
    private static readonly ENTRY_PATTERN = /^await ([A-Za-z0-9]+)\.main\(\);$/;
    private static readonly PUBLIC_PATTERN = /^\s+public /;
    private static readonly FILE_SCOPE_ALLOWED: readonly RegExp[] = [/^import /, /^export default /, /^}/, /^#!/, /^\s/, /^$/];
    private static readonly TEST_SCOPE_ALLOWED: readonly RegExp[] = [/^import /, /^test\(/, /^for \(/, /^}/, /^\s/, /^$/];
    private static readonly TYPES_SCOPE_ALLOWED: readonly RegExp[] = [
        /^import /,
        /^(?:export )?(?:interface|type|enum) /,
        /^}/,
        /^\s/,
        /^$/,
    ];

    private static files(): SourceFile[] {
        const root = CliRunner.PROJECT_ROOT;
        const files: SourceFile[] = [];

        for (const folder of CodeConventionsApplyAcrossSourceAndTests.FOLDERS) {
            CodeConventionsApplyAcrossSourceAndTests.collect(root, folder, files);
        }

        return files;
    }

    static violations(): ConventionViolation[] {
        return CodeConventionsApplyAcrossSourceAndTests.files().flatMap((file) =>
            CodeConventionsApplyAcrossSourceAndTests.violationsIn(file)
        );
    }

    static violationsIn(file: SourceFile): ConventionViolation[] {
        const lines = file.text.split(/\r?\n/);
        const violations: ConventionViolation[] = [];
        const isTypes = file.path.includes("/Types/");
        const isTest = file.path.endsWith(".test.ts");

        if (!isTypes && !isTest) {
            violations.push(...CodeConventionsApplyAcrossSourceAndTests.classViolations(file));
        }

        violations.push(...CodeConventionsApplyAcrossSourceAndTests.fileScopeViolations(file, lines, isTypes, isTest));
        violations.push(...CodeConventionsApplyAcrossSourceAndTests.commentViolations(file, lines));

        lines.forEach((line, index) => {
            if (!isTypes && CodeConventionsApplyAcrossSourceAndTests.TYPE_DECLARATION_PATTERN.test(line)) {
                violations.push({ path: file.path, line: index + 1, rule: "type declaration outside Types" });
            }

            if (CodeConventionsApplyAcrossSourceAndTests.PUBLIC_PATTERN.test(line)) {
                violations.push({ path: file.path, line: index + 1, rule: "public modifier" });
            }
        });

        return violations;
    }

    static filesSpellingOutGameVersion(): string[] {
        const version = VanillaLoader.sourceGameVersion();

        const scenarioFiles: SourceFile[] = [];

        CodeConventionsApplyAcrossSourceAndTests.collectScenarioText(
            CliRunner.PROJECT_ROOT,
            CodeConventionsApplyAcrossSourceAndTests.SCENARIOS_FOLDER,
            scenarioFiles
        );

        return [...CodeConventionsApplyAcrossSourceAndTests.files(), ...scenarioFiles]
            .filter((file) => file.path.startsWith("tests/") && file.text.includes(version))
            .map((file) => file.path);
    }

    static missingTestFiles(): string[] {
        const root = CliRunner.PROJECT_ROOT;
        const missing: string[] = [];

        for (const folder of CodeConventionsApplyAcrossSourceAndTests.TEST_FOLDERS) {
            for (const entry of fs.readdirSync(path.join(root, folder))) {
                if (!entry.endsWith(".test.ts")) {
                    continue;
                }

                const name = entry.slice(0, -".test.ts".length);

                for (const expected of ["tests/Helpers/" + name + ".ts", "tests/Types/" + name + "Types.ts"]) {
                    if (!fs.existsSync(path.join(root, expected))) {
                        missing.push(expected);
                    }
                }
            }
        }

        return missing;
    }

    static versions(): VersionPair {
        const packageJson = JSON.parse(fs.readFileSync(path.join(CliRunner.PROJECT_ROOT, "package.json"), "utf-8")) as Record<
            string,
            unknown
        >;

        return { toolVersion: Main.TOOL_VERSION, packageVersion: String(packageJson.version) };
    }

    private static collectScenarioText(root: string, relative: string, output: SourceFile[]): void {
        for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
            const entryPath = relative + "/" + entry.name;

            if (entry.isDirectory()) {
                CodeConventionsApplyAcrossSourceAndTests.collectScenarioText(root, entryPath, output);
                continue;
            }

            if (CliRunner.TEXT_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
                output.push({ path: entryPath, text: fs.readFileSync(path.join(root, entryPath), "utf-8") });
            }
        }
    }

    private static collect(root: string, relative: string, output: SourceFile[]): void {
        if (CodeConventionsApplyAcrossSourceAndTests.SKIPPED_FOLDERS.includes(relative)) {
            return;
        }

        for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
            const entryPath = relative + "/" + entry.name;

            if (entry.isDirectory()) {
                CodeConventionsApplyAcrossSourceAndTests.collect(root, entryPath, output);
                continue;
            }

            if (entry.name.endsWith(".ts")) {
                output.push({ path: entryPath, text: fs.readFileSync(path.join(root, entryPath), "utf-8") });
            }
        }
    }

    private static classViolations(file: SourceFile): ConventionViolation[] {
        const violations: ConventionViolation[] = [];
        const expected = path.basename(file.path, ".ts");
        const match = CodeConventionsApplyAcrossSourceAndTests.DEFAULT_CLASS_PATTERN.exec(file.text);
        const count = file.text.match(CodeConventionsApplyAcrossSourceAndTests.CLASS_PATTERN)?.length ?? 0;

        if (match === null || match[1] !== expected) {
            violations.push({ path: file.path, line: 1, rule: "default export class name differs from file name" });
        }

        if (count !== 1) {
            violations.push({ path: file.path, line: 1, rule: "more than one class" });
        }

        return violations;
    }

    private static fileScopeViolations(
        file: SourceFile,
        lines: readonly string[],
        isTypes: boolean,
        isTest: boolean
    ): ConventionViolation[] {
        const allowed = CodeConventionsApplyAcrossSourceAndTests.allowedAtFileScope(isTypes, isTest);
        const className = path.basename(file.path, ".ts");
        const violations: ConventionViolation[] = [];

        lines.forEach((line, index) => {
            if (allowed.some((pattern) => pattern.test(line))) {
                return;
            }

            const entry = CodeConventionsApplyAcrossSourceAndTests.ENTRY_PATTERN.exec(line);

            if (entry !== null && entry[1] === className && index === lines.length - 2) {
                return;
            }

            violations.push({ path: file.path, line: index + 1, rule: "statement at file scope" });
        });

        return violations;
    }

    private static allowedAtFileScope(isTypes: boolean, isTest: boolean): readonly RegExp[] {
        if (isTypes) {
            return CodeConventionsApplyAcrossSourceAndTests.TYPES_SCOPE_ALLOWED;
        }

        if (isTest) {
            return CodeConventionsApplyAcrossSourceAndTests.TEST_SCOPE_ALLOWED;
        }

        return CodeConventionsApplyAcrossSourceAndTests.FILE_SCOPE_ALLOWED;
    }

    private static commentViolations(file: SourceFile, lines: readonly string[]): ConventionViolation[] {
        const violations: ConventionViolation[] = [];
        const commentFree = CodeConventionsApplyAcrossSourceAndTests.COMMENT_FREE_FOLDERS.some((folder) =>
            file.path.startsWith(folder + "/")
        );
        let previousWasComment = false;

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            if (trimmed.startsWith("/*") || trimmed.startsWith("*/") || trimmed.startsWith("* ")) {
                violations.push({ path: file.path, line: index + 1, rule: "block comment" });
                previousWasComment = false;

                return;
            }

            if (!trimmed.startsWith("//")) {
                previousWasComment = trimmed.length === 0 ? previousWasComment : false;

                return;
            }

            if (commentFree) {
                violations.push({ path: file.path, line: index + 1, rule: "comment in src or tests" });
            }

            if (previousWasComment) {
                violations.push({ path: file.path, line: index + 1, rule: "comment longer than one line" });
            }

            if (trimmed.endsWith(".")) {
                violations.push({ path: file.path, line: index + 1, rule: "comment ends with a period" });
            }

            previousWasComment = true;
        });

        return violations;
    }
}
