import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LangKeyNotInSkinsJsonReportsUnmatchedKeyCase } from "../Types/LangKeyNotInSkinsJsonReportsUnmatchedKeyTypes.js";
import LangKeyNotInSkinsJson from "../../src/Checks/Skin/LangKeyNotInSkinsJson.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class LangKeyNotInSkinsJsonReportsUnmatchedKey {
    static readonly ID = "SKIN/302";
    static readonly CASES: readonly LangKeyNotInSkinsJsonReportsUnmatchedKeyCase[] = [
        { name: "every skin and skinpack key in en_US.lang has a matching skin", expectedIds: [], expectedPaths: [] },
        {
            name: "skinpack.sample_skin_pack.by attribution key is accepted",
            langFiles: { "en_US.lang": SkinPackFixture.DEFAULT_LANG + "skinpack.sample_skin_pack.by=Sample Creator\n" },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "skin.sample_skin_pack.Nope in en_US.lang has no matching skin",
            langFiles: { "en_US.lang": SkinPackFixture.DEFAULT_LANG + "skin.sample_skin_pack.Nope=Nope\n" },
            expectedIds: ["SKIN/302"],
            expectedPaths: [SkinPackFixture.ENGLISH_LANG_PATH],
        },
        {
            name: "skinpack.other in es_ES.lang has no matching pack and menu.title is outside the checked prefixes",
            langFiles: { "en_US.lang": SkinPackFixture.DEFAULT_LANG, "es_ES.lang": "skinpack.other=Otro\nmenu.title=Hola\n" },
            expectedIds: ["SKIN/302"],
            expectedPaths: [SkinPackFixture.ROOT + "/texts/es_ES.lang"],
        },
    ];

    static run(entry: LangKeyNotInSkinsJsonReportsUnmatchedKeyCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new LangKeyNotInSkinsJson(), entry);
    }
}
