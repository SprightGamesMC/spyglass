import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import Check from "../Check.js";
import ArtFileRoles from "./ArtFileRoles.js";

export default abstract class ArtRoleMissingCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        if (ArtFileRoles.withRole(context.model, this.role()).length > 0) {
            return [];
        }

        const expectedName = await this.expectedName(context);

        return [this.finding("No " + expectedName + " file in " + this.folder(), this.folder())];
    }

    protected abstract role(): ArtRole;

    protected abstract folder(): ArtFolder;

    protected abstract expectedName(context: CheckContext): Promise<string> | string;
}
