import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class FileOutsidePack extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.FILE_OUTSIDE_PACK,
        slug: "file-outside-pack",
        severity: "error",
        description: "File or folder not inside any pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const outside = context.model.filesOutsidePacks;
        const reported = outside.slice(0, PackLimits.FILE_OUTSIDE_PACK_FINDING_LIMIT);
        const notListed = outside.length - reported.length;

        return reported.map((file, index) => {
            const suffix = index === reported.length - 1 && notListed > 0 ? ", " + notListed + " more not listed" : "";

            return this.finding("File " + file.path + " is not inside any pack" + suffix, file.path);
        });
    }
}
