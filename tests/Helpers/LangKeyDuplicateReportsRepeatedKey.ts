import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LangKeyDuplicateReportsRepeatedKeyCase } from "../Types/LangKeyDuplicateReportsRepeatedKeyTypes.js";
import LangKeyDuplicate from "../../src/Checks/Lang/LangKeyDuplicate.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LangKeyDuplicateReportsRepeatedKey {
    static readonly ID = "LANG/601";
    static readonly CASES: readonly LangKeyDuplicateReportsRepeatedKeyCase[] = [
        {
            name: "two different keys appear once each",
            files: LangFixture.resourcePack({
                "languages.json": ["en_US"],
                "en_US.lang": "item.x.name=Sword\ntile.y.name=Block",
            }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "item.x.name is written twice in one file",
            files: LangFixture.resourcePack({
                "languages.json": ["en_US"],
                "en_US.lang": "item.x.name=Sword\ntile.y.name=Block\nitem.x.name=Blade",
            }),
            expectedIds: ["LANG/601"],
            expectedPaths: [LangFixture.langPath("en_US")],
        },
    ];

    static run(entry: LangKeyDuplicateReportsRepeatedKeyCase): Promise<FindingSummary> {
        return ModelFixture.summary(new LangKeyDuplicate(), entry.files);
    }
}
