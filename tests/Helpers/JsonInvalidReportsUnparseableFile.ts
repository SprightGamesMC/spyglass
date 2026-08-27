import type { Finding } from "../../src/Types/CheckTypes.js";
import type { JsonInvalidReportsUnparseableFileCase } from "../Types/JsonInvalidReportsUnparseableFileTypes.js";
import JsonInvalid from "../../src/Checks/File/JsonInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class JsonInvalidReportsUnparseableFile {
    static readonly ID = "FILE/201";
    static readonly CASES: readonly JsonInvalidReportsUnparseableFileCase[] = [
        { name: "object with one key parses as JSON", content: '{"a": 1}', expectFinding: false },
        {
            name: "line and block comments are stripped before parsing",
            content: '{\n // note\n "a": 1 /* block */\n}',
            expectFinding: false,
        },
        { name: "trailing comma does not parse as JSON", content: '{"a": 1,}', expectFinding: true },
        { name: "plain text does not parse as JSON", content: "not json at all", expectFinding: true },
    ];

    static run(content: string): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), "BP/entities/thing.json": content };
        return ModelFixture.findings(new JsonInvalid(), files);
    }
}
