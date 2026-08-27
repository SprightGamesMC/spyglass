import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { EnUsMissingReportsCatalogWithoutEnUsCase } from "../Types/EnUsMissingReportsCatalogWithoutEnUsTypes.js";
import EnUsMissing from "../../src/Checks/Lang/EnUsMissing.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class EnUsMissingReportsCatalogWithoutEnUs {
    static readonly ID = "LANG/102";
    static readonly CASES: readonly EnUsMissingReportsCatalogWithoutEnUsCase[] = [
        {
            name: "languages.json lists en_US and fr_FR so en_US is present",
            files: LangFixture.resourcePack({ "languages.json": ["en_US", "fr_FR"], "en_US.lang": "a=b", "fr_FR.lang": "a=c" }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "languages.json lists only fr_FR so en_US is missing",
            files: LangFixture.resourcePack({ "languages.json": ["fr_FR"], "fr_FR.lang": "a=c" }),
            expectedIds: ["LANG/102"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
        {
            name: "languages.json lists en_us which does not match en_US because case differs",
            files: LangFixture.resourcePack({ "languages.json": ["en_us"], "en_us.lang": "a=b" }),
            expectedIds: ["LANG/102"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
        {
            name: "empty languages.json lists no languages so en_US is missing",
            files: LangFixture.resourcePack({ "languages.json": [] }),
            expectedIds: ["LANG/102"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
    ];

    static run(entry: EnUsMissingReportsCatalogWithoutEnUsCase): Promise<FindingSummary> {
        return ModelFixture.summary(new EnUsMissing(), entry.files);
    }
}
