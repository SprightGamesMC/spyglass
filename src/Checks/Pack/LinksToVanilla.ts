import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { LinkResolution } from "../../Types/CrossReferenceTypes.js";
import CrossReferenceCheck from "../Common/CrossReferenceCheck.js";
import PackChecks from "./PackChecks.js";

export default class LinksToVanilla extends CrossReferenceCheck {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.LINKS_TO_VANILLA,
        slug: "links-to-vanilla",
        severity: "recommendation",
        description: "Definition references a vanilla id",
        excludedContentTypes: ["texture"],
    };

    protected readonly resolution: LinkResolution = "vanilla";

    protected message(kind: string, id: string): string {
        return "Referenced " + kind + " " + id + " is a vanilla id, avoid linking to vanilla content";
    }
}
