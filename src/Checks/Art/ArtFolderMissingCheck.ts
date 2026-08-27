import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import Check from "../Check.js";
import ArtFileRoles from "./ArtFileRoles.js";

export default abstract class ArtFolderMissingCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const folder = this.folder();

        if (ArtFileRoles.hasFolder(context.model, folder)) {
            return [];
        }

        return [this.finding("No " + folder + " folder with files at the root")];
    }

    protected abstract folder(): ArtFolder;
}
