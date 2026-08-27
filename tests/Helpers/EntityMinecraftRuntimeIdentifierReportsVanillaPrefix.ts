import type { Finding } from "../../src/Types/CheckTypes.js";
import type { EntityMinecraftRuntimeIdentifierReportsVanillaPrefixCase } from "../Types/EntityMinecraftRuntimeIdentifierReportsVanillaPrefixTypes.js";
import MinecraftRuntimeIdentifier from "../../src/Checks/Entity/MinecraftRuntimeIdentifier.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class EntityMinecraftRuntimeIdentifierReportsVanillaPrefix {
    static readonly ID = "ENTITY/601";
    static readonly PATH = "BP/entities/thing.json";
    static readonly CASES: readonly EntityMinecraftRuntimeIdentifierReportsVanillaPrefixCase[] = [
        {
            name: "runtime_identifier x:base uses a custom namespace",
            description: { identifier: "minecraft:zombie", runtime_identifier: "x:base" },
            expectFinding: false,
        },
        {
            name: "entity without runtime_identifier has no value to check",
            description: { identifier: "x:thing" },
            expectFinding: false,
        },
        {
            name: "runtime_identifier minecraft:zombie uses the minecraft prefix",
            description: { identifier: "x:thing", runtime_identifier: "minecraft:zombie" },
            expectFinding: true,
        },
        {
            name: "runtime_identifier Minecraft:zombie matches the minecraft prefix case insensitively",
            description: { identifier: "x:thing", runtime_identifier: "Minecraft:zombie" },
            expectFinding: true,
        },
    ];

    static excludedContentTypes(): readonly string[] | undefined {
        return new MinecraftRuntimeIdentifier().definition.excludedContentTypes;
    }

    static run(description: object): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            [EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.PATH]: {
                format_version: ModelFixture.DEFAULT_GAME_VERSION,
                "minecraft:entity": { description },
            },
        };

        return ModelFixture.findings(new MinecraftRuntimeIdentifier(), files);
    }
}
