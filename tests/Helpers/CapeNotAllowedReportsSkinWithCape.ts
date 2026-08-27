import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { CapeNotAllowedReportsSkinWithCapeCase } from "../Types/CapeNotAllowedReportsSkinWithCapeTypes.js";
import CapeNotAllowed from "../../src/Checks/Skin/CapeNotAllowed.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class CapeNotAllowedReportsSkinWithCape {
    static readonly ID = "SKIN/701";
    static readonly CASES: readonly CapeNotAllowedReportsSkinWithCapeCase[] = [
        { name: "skin without a cape field has no cape", expectedIds: [], expectedPaths: [] },
        {
            name: "skin with cape.png has a cape",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ cape: "cape.png" })]),
            expectedIds: ["SKIN/701"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: CapeNotAllowedReportsSkinWithCapeCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new CapeNotAllowed(), entry);
    }
}
