import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SkinsJsonInvalidReportsSchemaIssuesCase } from "../Types/SkinsJsonInvalidReportsSchemaIssuesTypes.js";
import SkinsJsonInvalid from "../../src/Checks/Skin/SkinsJsonInvalid.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class SkinsJsonInvalidReportsSchemaIssues {
    static readonly ID = "SKIN/201";
    static readonly CASES: readonly SkinsJsonInvalidReportsSchemaIssuesCase[] = [
        { name: "skins.json with serialize_name and skin entries matches the schema", expectedIds: [], expectedPaths: [] },
        {
            name: "skin entry without geometry lacks a required schema field",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ geometry: undefined })]),
            expectedIds: ["SKIN/201"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
        {
            name: "serialize_name number and skins object are two schema type errors",
            skinsJson: SkinPackFixture.skinsJson([], { serialize_name: 5, skins: {} }),
            expectedIds: ["SKIN/201", "SKIN/201"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH, SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: SkinsJsonInvalidReportsSchemaIssuesCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new SkinsJsonInvalid(), entry);
    }
}
