import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LanguagesJsonInvalidReportsNonStringListCase } from "../Types/LanguagesJsonInvalidReportsNonStringListTypes.js";
import LanguagesJsonInvalid from "../../src/Checks/Lang/LanguagesJsonInvalid.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LanguagesJsonInvalidReportsNonStringList {
    static readonly ID = "LANG/201";
    static readonly CASES: readonly LanguagesJsonInvalidReportsNonStringListCase[] = [
        {
            name: "languages.json that is a list of strings is valid",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "a=b" }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "languages.json that is an object instead of a list is invalid",
            files: LangFixture.resourcePack({ "languages.json": { en_US: true }, "en_US.lang": "a=b" }),
            expectedIds: ["LANG/201"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
        {
            name: "languages.json that contains the number 3 is not a list of language codes",
            files: LangFixture.resourcePack({ "languages.json": ["en_US", 3], "en_US.lang": "a=b" }),
            expectedIds: ["LANG/201"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
        {
            name: "unparseable languages.json is left to the JSON checks",
            files: LangFixture.resourcePack({ "languages.json": "[en_US", "en_US.lang": "a=b" }),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static run(entry: LanguagesJsonInvalidReportsNonStringListCase): Promise<FindingSummary> {
        return ModelFixture.summary(new LanguagesJsonInvalid(), entry.files);
    }
}
