import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LangLineInvalidReportsMalformedLineCase } from "../Types/LangLineInvalidReportsMalformedLineTypes.js";
import LangLineInvalid from "../../src/Checks/Lang/LangLineInvalid.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LangLineInvalidReportsMalformedLine {
    static readonly ID = "LANG/202";
    static readonly CASES: readonly LangLineInvalidReportsMalformedLineCase[] = [
        {
            name: "key and value pairs, a blank line, and a ## comment are valid lines",
            files: LangFixture.resourcePack({
                "languages.json": ["en_US"],
                "en_US.lang": "## comment\nitem.x.name=Sword\n\ntile.y.name=Block\t trailing note",
            }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "a line with no equals sign has no key and value",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "item.x.name=Sword\njust text" }),
            expectedIds: ["LANG/202"],
            expectedPaths: [LangFixture.langPath("en_US")],
        },
        {
            name: "a single hash comment is not the ## comment form",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "# comment\nitem.x.name=Sword" }),
            expectedIds: ["LANG/202"],
            expectedPaths: [LangFixture.langPath("en_US")],
        },
        {
            name: "an empty key and an empty value are both missing a part",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "=Sword\nitem.x.name=" }),
            expectedIds: ["LANG/202", "LANG/202"],
            expectedPaths: [LangFixture.langPath("en_US"), LangFixture.langPath("en_US")],
        },
    ];

    static run(entry: LangLineInvalidReportsMalformedLineCase): Promise<FindingSummary> {
        return ModelFixture.summary(new LangLineInvalid(), entry.files);
    }
}
