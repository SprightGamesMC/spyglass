import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DeprecatedOverrideCase } from "../Types/DeprecatedOverrideReportsLegacyTableKeyTypes.js";
import DeprecatedOverride from "../../src/Checks/Block/DeprecatedOverride.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class DeprecatedOverrideReportsLegacyTableKey {
    static readonly ID = "BLOCK/501";
    static readonly CATALOG_PATH = "RP/blocks.json";
    static readonly CASES: readonly DeprecatedOverrideCase[] = [
        {
            name: "stone is not a deprecated vanilla block key",
            catalog: { format_version: "1.21.40", stone: { textures: "stone" } },
            expectedKeys: [],
        },
        {
            name: "fletching_table is a deprecated vanilla block key",
            catalog: { fletching_table: { textures: "f" } },
            expectedKeys: ["fletching_table"],
        },
        {
            name: "fletching_table and smithing_table are both deprecated vanilla block keys",
            catalog: { fletching_table: { textures: "f" }, smithing_table: { textures: "s" } },
            expectedKeys: ["fletching_table", "smithing_table"],
        },
    ];

    static run(catalog: object): Promise<Finding[]> {
        const files = {
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [DeprecatedOverrideReportsLegacyTableKey.CATALOG_PATH]: catalog,
        };

        return ModelFixture.findings(new DeprecatedOverride(), files);
    }
}
