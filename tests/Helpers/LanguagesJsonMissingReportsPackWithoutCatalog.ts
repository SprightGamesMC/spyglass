import type { Finding } from "../../src/Types/CheckTypes.js";
import type { LanguagesJsonMissingReportsPackWithoutCatalogCase } from "../Types/LanguagesJsonMissingReportsPackWithoutCatalogTypes.js";
import LanguagesJsonMissing from "../../src/Checks/Lang/LanguagesJsonMissing.js";
import LangFixture from "./Core/LangFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LanguagesJsonMissingReportsPackWithoutCatalog {
    static readonly ID = "LANG/101";
    static readonly CASES: readonly LanguagesJsonMissingReportsPackWithoutCatalogCase[] = [
        {
            name: "resource pack with texts/languages.json has a language catalog",
            files: LangFixture.resourcePack({ "languages.json": ["en_US"], "en_US.lang": "a=b" }),
            expectedPacks: [],
        },
        {
            name: "resource pack with en_US.lang but no texts/languages.json has no language catalog",
            files: LangFixture.resourcePack({ "en_US.lang": "a=b" }),
            expectedPacks: [LangFixture.PACK_ROOT],
        },
        {
            name: "behavior pack without a texts folder has no language catalog",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            expectedPacks: ["BP"],
        },
    ];

    static run(entry: LanguagesJsonMissingReportsPackWithoutCatalogCase): Promise<Finding[]> {
        return ModelFixture.findings(new LanguagesJsonMissing(), entry.files);
    }
}
