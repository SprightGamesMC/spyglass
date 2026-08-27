import type Check from "../../../src/Checks/Check.js";
import type { Finding } from "../../../src/Types/CheckTypes.js";
import type { VanillaData } from "../../../src/Types/LoaderTypes.js";
import type { FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { BlockCatalogCase } from "../../Types/Core/SharedCaseTypes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class BlockCatalogFixture {
    static readonly CATALOG_PATH = "RP/blocks.json";
    private static readonly VANILLA: VanillaData = { files: {}, properties: { "blocks.json": { stone: "a", dirt: "b" } } };

    static run(check: Check, entry: BlockCatalogCase): Promise<Finding[]> {
        const files: Record<string, object> = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [BlockCatalogFixture.CATALOG_PATH]: entry.catalog,
        };

        entry.definedBlocks.forEach((identifier, index) => {
            files["BP/blocks/block" + index + ".json"] = {
                format_version: ModelFixture.DEFAULT_GAME_VERSION,
                "minecraft:block": { description: { identifier } },
            };
        });

        return ModelFixture.findings(check, files as FixtureFiles, { vanilla: BlockCatalogFixture.VANILLA });
    }
}
