import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LangFileNotInCatalogReportsUnlistedLangFileCase } from "../Types/LangFileNotInCatalogReportsUnlistedLangFileTypes.js";
import LangFileNotInCatalog from "../../src/Checks/Lang/LangFileNotInCatalog.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LangFileNotInCatalogReportsUnlistedLangFile {
    static readonly ID = "LANG/301";
    static readonly CASES: readonly LangFileNotInCatalogReportsUnlistedLangFileCase[] = [
        {
            name: "en_US.lang and fr_FR.lang are both listed in languages.json",
            files: LangFixture.resourcePack({ "languages.json": ["en_US", "fr_FR"], "en_US.lang": "a=b", "fr_FR.lang": "a=c" }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "de_DE.lang exists but de_DE is not listed in languages.json",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "a=b", "de_DE.lang": "a=d" }),
            expectedIds: ["LANG/301"],
            expectedPaths: [LangFixture.langPath("de_DE")],
        },
        {
            name: "en_us.lang does not match the listed en_US because case differs",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_us.lang": "a=b" }),
            expectedIds: ["LANG/301"],
            expectedPaths: [LangFixture.langPath("en_us")],
        },
    ];

    static run(entry: LangFileNotInCatalogReportsUnlistedLangFileCase): Promise<FindingSummary> {
        return ModelFixture.summary(new LangFileNotInCatalog(), entry.files);
    }
}
