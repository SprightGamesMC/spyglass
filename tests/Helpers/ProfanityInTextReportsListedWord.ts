import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ProfanityInTextReportsListedWordCase } from "../Types/ProfanityInTextReportsListedWordTypes.js";
import ProfanityInText from "../../src/Checks/Lang/ProfanityInText.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ProfanityInTextReportsListedWord {
    static readonly ID = "LANG/701";
    static readonly CASES: readonly ProfanityInTextReportsListedWordCase[] = [
        {
            name: "Assassin Blade contains no listed word because matching is by whole word",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "item.x.name=Assassin Blade" }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "a value with a listed word is profanity",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "item.x.name=Crap Sword" }),
            expectedIds: ["LANG/701"],
            expectedPaths: [LangFixture.langPath("en_US")],
        },
        {
            name: "a value with a listed two word phrase is profanity",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "item.x.name=Sofa King Chair" }),
            expectedIds: ["LANG/701"],
            expectedPaths: [LangFixture.langPath("en_US")],
        },
        {
            name: "a key is not checked because only the value is shown to the player",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "item.crap.name=Stick" }),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static run(entry: ProfanityInTextReportsListedWordCase): Promise<FindingSummary> {
        return ModelFixture.summary(new ProfanityInText(), entry.files);
    }
}
