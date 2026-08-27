import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BaseGameVersionBelowCurrentCase } from "../Types/BaseGameVersionBelowCurrentReportsOldTemplateVersionTypes.js";
import BaseGameVersionBelowCurrent from "../../src/Checks/World/BaseGameVersionBelowCurrent.js";
import ModelFixture from "./Core/ModelFixture.js";
import WorldTemplateFixture from "./World/WorldTemplateFixture.js";

export default abstract class BaseGameVersionBelowCurrentReportsOldTemplateVersion {
    static readonly ID = "WORLD/501";
    static readonly CASES: readonly BaseGameVersionBelowCurrentCase[] = [
        {
            name: "base_game_version 10.30.20 equals the current release",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            expectFinding: false,
        },
        {
            name: "base_game_version 10.29.0 is the previous minor which is allowed",
            header: { base_game_version: [10, 29, 0] },
            expectFinding: false,
        },
        {
            name: "base_game_version string 10.30.20 is read like an array and equals the current release",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION },
            expectFinding: false,
        },
        { name: "base_game_version * is not a version so it is not compared", header: { base_game_version: "*" }, expectFinding: false },
        {
            name: "base_game_version 0.30.20 has a lower major than the current release",
            header: { base_game_version: [0, 30, 20] },
            expectFinding: true,
        },
        {
            name: "base_game_version 10.20.0 is older than the previous minor",
            header: { base_game_version: [10, 20, 0] },
            expectFinding: true,
        },
        {
            name: "base_game_version 10.30.10 has a lower patch than the current release",
            header: { base_game_version: [10, 30, 10] },
            expectFinding: true,
        },
    ];

    static run(entry: BaseGameVersionBelowCurrentCase): Promise<Finding[]> {
        return WorldTemplateFixture.run(new BaseGameVersionBelowCurrent(), entry);
    }
}
