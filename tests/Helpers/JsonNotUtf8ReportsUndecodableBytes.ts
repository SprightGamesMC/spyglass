import type { Finding } from "../../src/Types/CheckTypes.js";
import type { JsonNotUtf8ReportsUndecodableBytesCase } from "../Types/JsonNotUtf8ReportsUndecodableBytesTypes.js";
import JsonNotUtf8 from "../../src/Checks/File/JsonNotUtf8.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class JsonNotUtf8ReportsUndecodableBytes {
    static readonly ID = "FILE/203";
    static readonly PATH = "BP/entities/thing.json";
    static readonly CASES: readonly JsonNotUtf8ReportsUndecodableBytesCase[] = [
        { name: "ascii bytes decode as UTF-8", content: new TextEncoder().encode('{"a": 1}'), expectFinding: false },
        {
            name: "multibyte e acute decodes as UTF-8",
            content: new TextEncoder().encode('{"a": "' + String.fromCharCode(233) + '"}'),
            expectFinding: false,
        },
        {
            name: "UTF-16 bytes with a byte order mark do not decode as UTF-8",
            content: new Uint8Array([0xff, 0xfe, 0x7b, 0x00, 0x7d, 0x00]),
            expectFinding: true,
        },
        {
            name: "0xc3 followed by 0x28 is an invalid continuation byte",
            content: new Uint8Array([0x7b, 0xc3, 0x28, 0x7d]),
            expectFinding: true,
        },
    ];

    static run(content: Uint8Array): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), [JsonNotUtf8ReportsUndecodableBytes.PATH]: content };
        return ModelFixture.findings(new JsonNotUtf8(), files);
    }
}
