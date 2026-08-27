import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LocKeyWhitespaceReportsPaddedValueCase } from "../Types/LocKeyWhitespaceReportsPaddedValueTypes.js";
import LocKeyWhitespace from "../../src/Checks/Skin/LocKeyWhitespace.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class LocKeyWhitespaceReportsPaddedValue {
    static readonly ID = "SKIN/206";
    static readonly CASES: readonly LocKeyWhitespaceReportsPaddedValueCase[] = [
        { name: "values without leading or trailing spaces are trimmed", expectedIds: [], expectedPaths: [] },
        {
            name: "other.key in es_ES.lang has trailing spaces even though it is not a skin key",
            langFiles: { "en_US.lang": SkinPackFixture.DEFAULT_LANG, "es_ES.lang": "other.key=Hola  \n" },
            expectedIds: ["SKIN/206"],
            expectedPaths: [SkinPackFixture.ROOT + "/texts/es_ES.lang"],
        },
        {
            name: "skinpack key in en_US.lang has a leading space",
            langFiles: { "en_US.lang": "skinpack.sample_skin_pack= Sample\n" },
            expectedIds: ["SKIN/206"],
            expectedPaths: [SkinPackFixture.ENGLISH_LANG_PATH],
        },
    ];

    static run(entry: LocKeyWhitespaceReportsPaddedValueCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new LocKeyWhitespace(), entry);
    }
}
