import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestStructureLoader from "../../Loaders/ManifestStructureLoader.js";
import Check from "../Check.js";

export default abstract class ManifestCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const manifest = await ManifestStructureLoader.read(context.loaders, pack);

            if (manifest === undefined) {
                continue;
            }

            findings.push(...(await this.checkManifest(context, pack, manifest)));
        }

        return findings;
    }

    protected abstract checkManifest(context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]>;

    protected manifestFinding(pack: Pack, message: string, field?: string): Finding {
        return this.finding(message, pack.manifestPath, pack.root, field === undefined ? undefined : { field });
    }

    protected duplicates(values: readonly string[]): string[] {
        const seen = new Set<string>();
        const repeated = new Set<string>();

        for (const value of values) {
            if (seen.has(value)) {
                repeated.add(value);
            }

            seen.add(value);
        }

        return [...repeated];
    }
}
