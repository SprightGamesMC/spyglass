import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaIdentifierLoader from "../../Loaders/PersonaIdentifierLoader.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class NamePrefixMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.NAME_PREFIX_MISMATCH,
        slug: "name-prefix-mismatch",
        severity: "error",
        description: "Art files do not share one content name prefix",
    };

    private static referencePrefix(entries: readonly ClassifiedArtFile[]): string | undefined {
        const keyArt = entries.find((entry) => entry.role === "key_art");

        if (keyArt !== undefined) {
            return keyArt.prefix;
        }

        const counts = new Map<string, number>();

        for (const entry of entries) {
            counts.set(entry.prefix, (counts.get(entry.prefix) ?? 0) + 1);
        }

        let best: string | undefined;

        for (const [prefix, count] of counts) {
            if (best === undefined || count > (counts.get(best) ?? 0)) {
                best = prefix;
            }
        }

        return best;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const entries = ArtFileRoles.classifyAll(context.model).filter((entry) => entry.role !== "unknown");
        const identity = await PersonaIdentifierLoader.load(context);
        const identifier = identity?.pieceName;

        if (identifier !== undefined) {
            return this.reportDifferences(entries, identifier, "piece identifier " + identifier);
        }

        const marketing = entries.filter((entry) => entry.file.folder === ArtLimits.MARKETING_FOLDER);
        const store = entries.filter((entry) => entry.file.folder === ArtLimits.STORE_FOLDER);
        const marketingPrefix = NamePrefixMismatch.referencePrefix(marketing);
        const findings: Finding[] = [];

        if (marketingPrefix !== undefined) {
            const storePrefix = marketingPrefix.toLowerCase();

            findings.push(...this.reportDifferences(marketing, marketingPrefix, ArtLimits.MARKETING_FOLDER + " prefix " + marketingPrefix));
            findings.push(
                ...this.reportDifferences(store, storePrefix, "lower case " + ArtLimits.MARKETING_FOLDER + " prefix " + storePrefix)
            );

            return findings;
        }

        const storePrefix = NamePrefixMismatch.referencePrefix(store);

        if (storePrefix !== undefined) {
            findings.push(...this.reportDifferences(store, storePrefix, ArtLimits.STORE_FOLDER + " prefix " + storePrefix));
        }

        return findings;
    }

    private reportDifferences(entries: readonly ClassifiedArtFile[], expected: string, expectedDescription: string): Finding[] {
        const findings: Finding[] = [];

        for (const entry of entries) {
            if (entry.prefix === expected) {
                continue;
            }

            findings.push(this.finding("Name prefix " + entry.prefix + " does not match the " + expectedDescription, entry.file.path));
        }

        return findings;
    }
}
