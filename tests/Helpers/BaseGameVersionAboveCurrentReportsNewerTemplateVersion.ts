import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BaseGameVersionAboveCurrentCase } from "../Types/BaseGameVersionAboveCurrentReportsNewerTemplateVersionTypes.js";
import BaseGameVersionAboveCurrent from "../../src/Checks/World/BaseGameVersionAboveCurrent.js";
import WorldTemplateFixture from "./World/WorldTemplateFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BaseGameVersionAboveCurrentReportsNewerTemplateVersion {
    static readonly ID = "WORLD/502";
    static readonly CASES: readonly BaseGameVersionAboveCurrentCase[] = [
        {
            name: "base_game_version 10.30.20 equals the current release",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            expectFinding: false,
        },
        {
            name: "base_game_version 10.20.0 is older than the current release so it is not above",
            header: { base_game_version: [10, 20, 0] },
            expectFinding: false,
        },
        {
            name: "base_game_version 10.31.0 has a higher minor than the current release",
            header: { base_game_version: [10, 31, 0] },
            expectFinding: true,
        },
        {
            name: "base_game_version 10.30.30 has a higher patch than the current release",
            header: { base_game_version: [10, 30, 30] },
            expectFinding: true,
        },
        {
            name: "base_game_version 11.0.0 has a higher major than the current release",
            header: { base_game_version: [11, 0, 0] },
            expectFinding: true,
        },
    ];

    static run(entry: BaseGameVersionAboveCurrentCase): Promise<Finding[]> {
        return WorldTemplateFixture.run(new BaseGameVersionAboveCurrent(), entry);
    }
}
