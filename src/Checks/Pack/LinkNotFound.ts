import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { LinkResolution } from "../../Types/CrossReferenceTypes.js";
import CrossReferenceCheck from "../Common/CrossReferenceCheck.js";
import PackChecks from "./PackChecks.js";

export default class LinkNotFound extends CrossReferenceCheck {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.LINK_NOT_FOUND,
        slug: "link-not-found",
        severity: "warning",
        description: "Definition references an id that does not exist",
    };

    protected readonly resolution: LinkResolution = "missing";

    protected message(kind: string, id: string): string {
        return "Referenced " + kind + " " + id + " is not defined in any pack";
    }
}
