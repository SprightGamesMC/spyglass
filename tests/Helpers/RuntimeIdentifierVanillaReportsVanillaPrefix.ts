import type { Finding } from "../../src/Types/CheckTypes.js";
import type { RuntimeIdentifierVanillaReportsVanillaPrefixCase } from "../Types/RuntimeIdentifierVanillaReportsVanillaPrefixTypes.js";
import RuntimeIdentifierVanilla from "../../src/Checks/Addon/RuntimeIdentifierVanilla.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class RuntimeIdentifierVanillaReportsVanillaPrefix {
    static readonly ID = "ADDON/212";
    static readonly PATH = "BP/entities/thing.json";
    static readonly CASES: readonly RuntimeIdentifierVanillaReportsVanillaPrefixCase[] = [
        {
            name: "runtime_identifier spright_cave:base uses a custom namespace",
            description: { identifier: "spright_cave:thing", runtime_identifier: "spright_cave:base" },
            expectFinding: false,
        },
        {
            name: "entity without runtime_identifier has no value to check",
            description: { identifier: "spright_cave:thing" },
            expectFinding: false,
        },
        {
            name: "runtime_identifier minecraft:zombie uses the minecraft prefix",
            description: { identifier: "spright_cave:thing", runtime_identifier: "minecraft:zombie" },
            expectFinding: true,
        },
    ];

    static run(description: object): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            [RuntimeIdentifierVanillaReportsVanillaPrefix.PATH]: {
                format_version: ModelFixture.DEFAULT_GAME_VERSION,
                "minecraft:entity": { description },
            },
        };

        return ModelFixture.findings(new RuntimeIdentifierVanilla(), files);
    }
}
