import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BaseGameVersionWildcardCase } from "../Types/BaseGameVersionWildcardReportsStarValueTypes.js";
import BaseGameVersionWildcard from "../../src/Checks/World/BaseGameVersionWildcard.js";
import WorldTemplateFixture from "./World/WorldTemplateFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BaseGameVersionWildcardReportsStarValue {
    static readonly ID = "WORLD/206";
    static readonly CASES: readonly BaseGameVersionWildcardCase[] = [
        {
            name: "base_game_version 10.30.20 is a version not a wildcard",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            expectFinding: false,
        },
        { name: "header without base_game_version has no wildcard", header: {}, expectFinding: false },
        { name: "base_game_version * is a wildcard", header: { base_game_version: "*" }, expectFinding: true },
    ];

    static run(entry: BaseGameVersionWildcardCase): Promise<Finding[]> {
        return WorldTemplateFixture.run(new BaseGameVersionWildcard(), entry);
    }
}
