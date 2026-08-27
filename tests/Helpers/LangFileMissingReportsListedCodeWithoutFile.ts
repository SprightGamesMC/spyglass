import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LangFileMissingReportsListedCodeWithoutFileCase } from "../Types/LangFileMissingReportsListedCodeWithoutFileTypes.js";
import LangFileMissing from "../../src/Checks/Lang/LangFileMissing.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LangFileMissingReportsListedCodeWithoutFile {
    static readonly ID = "LANG/103";
    static readonly CASES: readonly LangFileMissingReportsListedCodeWithoutFileCase[] = [
        {
            name: "en_US and fr_FR are listed and both lang files exist",
            files: LangFixture.resourcePack({ "languages.json": ["en_US", "fr_FR"], "en_US.lang": "a=b", "fr_FR.lang": "a=c" }),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "fr_FR is listed but fr_FR.lang does not exist",
            files: LangFixture.resourcePack({ "languages.json": ["en_US", "fr_FR"], "en_US.lang": "a=b" }),
            expectedIds: ["LANG/103"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
        {
            name: "en_us.lang does not match the listed en_US because case differs",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_us.lang": "a=b" }),
            expectedIds: ["LANG/103"],
            expectedPaths: [LangFixture.CATALOG_PATH],
        },
    ];

    static run(entry: LangFileMissingReportsListedCodeWithoutFileCase): Promise<FindingSummary> {
        return ModelFixture.summary(new LangFileMissing(), entry.files);
    }
}
