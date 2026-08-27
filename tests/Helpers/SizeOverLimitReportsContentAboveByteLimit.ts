import type { Finding } from "../../src/Types/CheckTypes.js";
import type { SizeOverLimitReportsContentAboveByteLimitCase } from "../Types/SizeOverLimitReportsContentAboveByteLimitTypes.js";
import PackLimits from "../../src/Checks/Pack/PackLimits.js";
import SizeOverLimit from "../../src/Checks/Pack/SizeOverLimit.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class SizeOverLimitReportsContentAboveByteLimit {
    static readonly ID = "PACK/401";
    static readonly CASES: readonly SizeOverLimitReportsContentAboveByteLimitCase[] = [
        { name: "10 byte pack is under the 250 MB limit", packBytes: 10, outsideBytes: 0, expectFinding: false },
        {
            name: "pack one byte over 250 MB is above the limit",
            packBytes: PackLimits.SIZE_LIMIT_BYTES + 1,
            outsideBytes: 0,
            expectFinding: true,
        },
        {
            name: "file one byte over 250 MB outside any pack does not count toward pack size",
            packBytes: 10,
            outsideBytes: PackLimits.SIZE_LIMIT_BYTES + 1,
            expectFinding: false,
        },
    ];

    static run(packBytes: number, outsideBytes: number): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "BP/structures/big.mcstructure": new Uint8Array(packBytes),
            "outside/big.bin": new Uint8Array(outsideBytes),
        };
        return ModelFixture.findings(new SizeOverLimit(), files);
    }
}
