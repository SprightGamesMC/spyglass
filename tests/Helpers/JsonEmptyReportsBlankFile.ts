import type { Finding } from "../../src/Types/CheckTypes.js";
import type { JsonEmptyReportsBlankFileCase } from "../Types/JsonEmptyReportsBlankFileTypes.js";
import JsonEmpty from "../../src/Checks/File/JsonEmpty.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class JsonEmptyReportsBlankFile {
    static readonly ID = "FILE/202";
    static readonly PATH = "BP/entities/thing.json";
    static readonly CASES: readonly JsonEmptyReportsBlankFileCase[] = [
        { name: "object with one key has content", content: '{"a": 1}', expectFinding: false },
        { name: "empty braces are two characters of content", content: "{}", expectFinding: false },
        { name: "zero bytes is an empty file", content: "", expectFinding: true },
        { name: "single brace is too short to be JSON", content: "{", expectFinding: true },
        { name: "whitespace only has no content", content: "   \n", expectFinding: true },
    ];

    static run(content: string): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), [JsonEmptyReportsBlankFile.PATH]: content };
        return ModelFixture.findings(new JsonEmpty(), files);
    }
}
