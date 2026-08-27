import type { CheckContext, CheckDefinition, Finding, FindingLocation } from "../Types/CheckTypes.js";
import CheckIds from "./CheckIds.js";

export default abstract class Check {
    abstract readonly definition: CheckDefinition;

    abstract run(context: CheckContext): Promise<Finding[]>;

    get id(): string {
        return CheckIds.of(this.definition);
    }

    protected finding(message: string, path?: string, pack?: string, location?: FindingLocation): Finding {
        return {
            id: this.id,
            slug: this.definition.slug,
            severity: this.definition.severity,
            message,
            path,
            pack,
            location,
        };
    }
}
