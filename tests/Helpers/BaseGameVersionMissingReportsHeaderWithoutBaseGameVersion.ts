import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BaseGameVersionMissingCase } from "../Types/BaseGameVersionMissingReportsHeaderWithoutBaseGameVersionTypes.js";
import BaseGameVersionMissing from "../../src/Checks/World/BaseGameVersionMissing.js";
import WorldTemplateFixture from "./World/WorldTemplateFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion {
    static readonly ID = "WORLD/103";
    static readonly CASES: readonly BaseGameVersionMissingCase[] = [
        {
            name: "header with base_game_version 10.30.20 has the field",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            expectFinding: false,
        },
        { name: "header with base_game_version * still has the field", header: { base_game_version: "*" }, expectFinding: false },
        { name: "header without base_game_version is missing it", header: { lock_template_options: true }, expectFinding: true },
    ];

    static run(entry: BaseGameVersionMissingCase): Promise<Finding[]> {
        return WorldTemplateFixture.run(new BaseGameVersionMissing(), entry);
    }
}
