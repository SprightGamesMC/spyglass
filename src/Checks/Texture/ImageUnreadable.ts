import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";

export default class ImageUnreadable extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.IMAGE_UNREADABLE,
        slug: "image-unreadable",
        severity: "warning",
        description: "Image metadata cannot be read",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const failure of memory.failures) {
                if (failure.status !== "invalid") {
                    continue;
                }

                findings.push(this.finding("Image metadata cannot be read", failure.item.path, memory.pack.root));
            }
        }

        return findings;
    }
}
