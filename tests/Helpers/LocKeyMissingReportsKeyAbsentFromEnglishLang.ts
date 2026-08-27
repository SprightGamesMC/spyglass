import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LocKeyMissingReportsKeyAbsentFromEnglishLangCase } from "../Types/LocKeyMissingReportsKeyAbsentFromEnglishLangTypes.js";
import LocKeyMissing from "../../src/Checks/Skin/LocKeyMissing.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class LocKeyMissingReportsKeyAbsentFromEnglishLang {
    static readonly ID = "SKIN/102";
    static readonly CASES: readonly LocKeyMissingReportsKeyAbsentFromEnglishLangCase[] = [
        { name: "skinpack and both skin keys are in en_US.lang", expectedIds: [], expectedPaths: [] },
        {
            name: "en_US.lang has only the skinpack key so both skin keys are absent",
            langFiles: { "en_US.lang": "skinpack.sample_skin_pack=Sample\n" },
            expectedIds: ["SKIN/102", "SKIN/102"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH, SkinPackFixture.SKINS_JSON_PATH],
        },
        {
            name: "keys in es_ES.lang only do not count so all three keys are absent from en_US.lang",
            langFiles: { "es_ES.lang": SkinPackFixture.DEFAULT_LANG },
            expectedIds: ["SKIN/102", "SKIN/102", "SKIN/102"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH, SkinPackFixture.SKINS_JSON_PATH, SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: LocKeyMissingReportsKeyAbsentFromEnglishLangCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new LocKeyMissing(), entry);
    }
}
