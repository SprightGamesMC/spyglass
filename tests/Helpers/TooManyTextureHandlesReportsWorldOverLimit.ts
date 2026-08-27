import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { TextureHandleCase } from "../Types/TooManyTextureHandlesReportsWorldOverLimitTypes.js";
import TooManyTextureHandles from "../../src/Checks/World/TooManyTextureHandles.js";
import WorldLimits from "../../src/Checks/World/WorldLimits.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class TooManyTextureHandlesReportsWorldOverLimit {
    static readonly ID = "WORLD/401";
    static readonly CASES: readonly TextureHandleCase[] = [
        { name: "5 texture handles is under the limit", handleCount: 5, nested: true, worldCount: 1, expectFinding: false },
        {
            name: "3000 texture handles is at the limit",
            handleCount: WorldLimits.TEXTURE_HANDLE_LIMIT,
            nested: true,
            worldCount: 1,
            expectFinding: false,
        },
        {
            name: "3001 texture handles in a pack nested in the world is above the limit",
            handleCount: WorldLimits.TEXTURE_HANDLE_LIMIT + 1,
            nested: true,
            worldCount: 1,
            expectFinding: true,
        },
        {
            name: "3001 texture handles in a global pack counts for the only world",
            handleCount: WorldLimits.TEXTURE_HANDLE_LIMIT + 1,
            nested: false,
            worldCount: 1,
            expectFinding: true,
        },
        {
            name: "3001 texture handles in a global pack is not counted when two worlds exist",
            handleCount: WorldLimits.TEXTURE_HANDLE_LIMIT + 1,
            nested: false,
            worldCount: 2,
            expectFinding: false,
        },
    ];

    static async run(entry: TextureHandleCase): Promise<Finding[]> {
        const packRoot = entry.nested ? "World/resource_packs/RP" : "RP";
        const files: Record<string, FixtureFiles[string]> = {
            "World/manifest.json": ModelFixture.worldTemplateManifest(),
            [packRoot + "/manifest.json"]: ModelFixture.resourceManifest(),
            [packRoot + "/entity/thing.entity.json"]: TooManyTextureHandlesReportsWorldOverLimit.entity(entry.handleCount),
        };

        if (entry.worldCount > 1) {
            files["Other/manifest.json"] = ModelFixture.worldTemplateManifest({
                header: { ...(ModelFixture.worldTemplateManifest().header as object), uuid: "0f80bc8e-7d8b-4c9a-9e4f-6a7b8c9daebf" },
            });
        }

        return ModelFixture.findings(new TooManyTextureHandles(), files, { contentType: "world" });
    }

    private static entity(handleCount: number): object {
        const textures: Record<string, string> = {};

        for (let index = 0; index < handleCount; index += 1) {
            textures["t" + index] = "textures/entity/thing_" + index;
        }

        return {
            format_version: "1.10.0",
            "minecraft:client_entity": { description: { identifier: "test:thing", textures } },
        };
    }
}
