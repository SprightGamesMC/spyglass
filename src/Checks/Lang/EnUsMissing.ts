import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class EnUsMissing extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.EN_US_MISSING,
        slug: "en-us-missing",
        severity: "error",
        description: "languages.json does not list en_US",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            if (catalog.status !== "ok" || catalog.item === undefined) {
                continue;
            }

            if (catalog.codes.includes(LangLimits.PRIMARY_LANGUAGE)) {
                continue;
            }

            findings.push(
                this.finding(
                    "languages.json lists " +
                        (catalog.codes.join(", ") || "no languages") +
                        ", " +
                        LangLimits.PRIMARY_LANGUAGE +
                        " is required",
                    catalog.item.path,
                    pack.root
                )
            );
        }

        return findings;
    }
}
