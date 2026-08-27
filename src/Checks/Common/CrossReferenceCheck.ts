import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { LinkResolution } from "../../Types/CrossReferenceTypes.js";
import CrossReferenceLoader from "../../Loaders/CrossReferenceLoader.js";
import Check from "../Check.js";

export default abstract class CrossReferenceCheck extends Check {
    protected abstract readonly resolution: LinkResolution;

    async run(context: CheckContext): Promise<Finding[]> {
        const index = await CrossReferenceLoader.load(context);
        const reported = new Set<string>();
        const findings: Finding[] = [];

        for (const reference of index.references) {
            const key = reference.kind + "|" + reference.id + "|" + reference.path;

            if (reported.has(key) || CrossReferenceLoader.resolve(context, index, reference) !== this.resolution) {
                continue;
            }

            reported.add(key);

            const kind = CrossReferenceLoader.describeKind(reference.kind);

            findings.push(
                this.finding(
                    this.message(kind, reference.id),
                    reference.path,
                    reference.pack,
                    reference.field === undefined ? undefined : { field: reference.field }
                )
            );
        }

        return findings;
    }

    protected abstract message(kind: string, id: string): string;
}
