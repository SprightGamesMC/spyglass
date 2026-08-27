import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureListLoader from "../../Loaders/TextureListLoader.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";

export default class TextureSetInTextureList extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TEXTURE_SET_IN_TEXTURE_LIST,
        slug: "texture-set-in-texture-list",
        severity: "warning",
        description: "Texture set image listed in texture_list.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const [path, keys] of await TextureListLoader.listedKeysByList(context, memory.pack)) {
                for (const key of keys) {
                    if (!memory.companionKeys.has(key)) {
                        continue;
                    }

                    findings.push(this.finding("Texture set image " + key + " is listed in texture_list.json", path, memory.pack.root));
                }
            }
        }

        return findings;
    }
}
