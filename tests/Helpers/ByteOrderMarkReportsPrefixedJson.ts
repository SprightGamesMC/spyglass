import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ByteOrderMarkReportsPrefixedJsonCase } from "../Types/ByteOrderMarkReportsPrefixedJsonTypes.js";
import ByteOrderMark from "../../src/Checks/File/ByteOrderMark.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ByteOrderMarkReportsPrefixedJson {
    static readonly ID = "FILE/204";
    static readonly PATH = "BP/entities/thing.json";
    static readonly CASES: readonly ByteOrderMarkReportsPrefixedJsonCase[] = [
        {
            name: "json with no prefix does not start with a byte order mark",
            content: new TextEncoder().encode('{"a": 1}'),
            expectFinding: false,
        },
        {
            name: "json prefixed with EF BB BF starts with a byte order mark",
            content: new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode('{"a": 1}')]),
            expectFinding: true,
        },
        {
            name: "EF BB BF with nothing after it still starts with a byte order mark",
            content: new Uint8Array([0xef, 0xbb, 0xbf]),
            expectFinding: true,
        },
    ];

    static run(content: Uint8Array): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), [ByteOrderMarkReportsPrefixedJson.PATH]: content };
        return ModelFixture.findings(new ByteOrderMark(), files);
    }
}
