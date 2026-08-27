import type { Finding } from "../../src/Types/CheckTypes.js";
import type { LockTemplateOptionsMissingCase } from "../Types/LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOptionTypes.js";
import LockTemplateOptionsMissing from "../../src/Checks/World/LockTemplateOptionsMissing.js";
import WorldTemplateFixture from "./World/WorldTemplateFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption {
    static readonly ID = "WORLD/104";
    static readonly CASES: readonly LockTemplateOptionsMissingCase[] = [
        {
            name: "format 2 header with lock_template_options false has the field",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY, lock_template_options: false },
            expectFinding: false,
        },
        {
            name: "format 2 header without lock_template_options is missing it",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            expectFinding: true,
        },
        {
            name: "format 1 header without lock_template_options is not checked",
            header: { base_game_version: ModelFixture.FICTIONAL_GAME_VERSION_ARRAY },
            formatVersion: 1,
            expectFinding: false,
        },
    ];

    static run(entry: LockTemplateOptionsMissingCase): Promise<Finding[]> {
        return WorldTemplateFixture.run(new LockTemplateOptionsMissing(), entry);
    }
}
