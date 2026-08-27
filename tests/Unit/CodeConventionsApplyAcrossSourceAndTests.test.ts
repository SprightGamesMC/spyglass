import assert from "node:assert/strict";
import { test } from "node:test";
import CodeConventionsApplyAcrossSourceAndTests from "../Helpers/CodeConventionsApplyAcrossSourceAndTests.js";

test("every file under src, tests, and scripts follows the file conventions", () => {
    assert.deepEqual(CodeConventionsApplyAcrossSourceAndTests.violations(), []);
});

test("every unit and integration test has a helper and a types file of the same name", () => {
    assert.deepEqual(CodeConventionsApplyAcrossSourceAndTests.missingTestFiles(), []);
});

test("no test file writes the game version of the vanilla samples tag", () => {
    assert.deepEqual(CodeConventionsApplyAcrossSourceAndTests.filesSpellingOutGameVersion(), []);
});

test("Main.TOOL_VERSION equals the package.json version", () => {
    const versions = CodeConventionsApplyAcrossSourceAndTests.versions();

    assert.equal(versions.toolVersion, versions.packageVersion);
});

test("a file with a second class, a block comment, a public modifier, and an interface outside Types reports each rule", () => {
    const text = [
        'import fs from "node:fs";',
        "",
        "interface Details {",
        "    readonly size: number;",
        "}",
        "",
        "/* block */",
        "export default class Sample {",
        "    public run(): void {",
        "        fs.readFileSync(Sample.name);",
        "    }",
        "}",
        "",
        "class Other {}",
        "",
    ].join("\n");
    const rules = CodeConventionsApplyAcrossSourceAndTests.violationsIn({ path: "src/Sample.ts", text }).map((entry) => entry.rule);

    assert.deepEqual(
        rules.sort(),
        [
            "block comment",
            "more than one class",
            "public modifier",
            "statement at file scope",
            "statement at file scope",
            "statement at file scope",
            "type declaration outside Types",
        ].sort()
    );
});

test("a file under src with one line comment reports a comment in src or tests", () => {
    const text = [
        'import fs from "node:fs";',
        "",
        "export default class Sample {",
        "    run(): void {",
        "        // format 1.8.0 is the last version that reads this key",
        "        fs.readFileSync(Sample.name);",
        "    }",
        "}",
        "",
    ].join("\n");
    const rules = CodeConventionsApplyAcrossSourceAndTests.violationsIn({ path: "src/Sample.ts", text }).map((entry) => entry.rule);

    assert.deepEqual(rules, ["comment in src or tests"]);
});

test("a file under scripts with one short line comment reports nothing", () => {
    const text = [
        'import fs from "node:fs";',
        "",
        "export default class Sample {",
        "    run(): void {",
        "        // format 1.8.0 is the last version that reads this key",
        "        fs.readFileSync(Sample.name);",
        "    }",
        "}",
        "",
    ].join("\n");

    assert.deepEqual(CodeConventionsApplyAcrossSourceAndTests.violationsIn({ path: "scripts/Sample.ts", text }), []);
});

test("a file named after its only class with no comments reports nothing", () => {
    const text = [
        'import fs from "node:fs";',
        "",
        "export default class Sample {",
        "    run(): void {",
        "        fs.readFileSync(Sample.name);",
        "    }",
        "}",
        "",
    ].join("\n");

    assert.deepEqual(CodeConventionsApplyAcrossSourceAndTests.violationsIn({ path: "src/Sample.ts", text }), []);
});
