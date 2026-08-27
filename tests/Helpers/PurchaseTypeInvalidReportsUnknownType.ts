import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PurchaseTypeInvalidReportsUnknownTypeCase } from "../Types/PurchaseTypeInvalidReportsUnknownTypeTypes.js";
import PurchaseTypeInvalid from "../../src/Checks/Skin/PurchaseTypeInvalid.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class PurchaseTypeInvalidReportsUnknownType {
    static readonly ID = "SKIN/207";
    static readonly CASES: readonly PurchaseTypeInvalidReportsUnknownTypeCase[] = [
        { name: "skin types free and paid are the allowed purchase types", expectedIds: [], expectedPaths: [] },
        {
            name: "skin type premium is not free or paid",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ type: "premium" })]),
            expectedIds: ["SKIN/207"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: PurchaseTypeInvalidReportsUnknownTypeCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new PurchaseTypeInvalid(), entry);
    }
}
