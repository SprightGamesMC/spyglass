import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";
import Check from "../Check.js";
import ArtImages from "./ArtImages.js";

export default abstract class ArtDpiCheck extends Check {
    protected abstract readonly folder: ArtFolder;
    protected abstract readonly dpi: number;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.art) {
            if (file.folder !== this.folder) {
                continue;
            }

            const metadata = await ArtImages.read(context.loaders, file);

            if (metadata === undefined || ArtImages.dpiMatches(metadata, this.dpi)) {
                continue;
            }

            findings.push(this.finding("DPI is " + ArtImages.describeDpi(metadata) + ", expected " + this.dpi, file.path));
        }

        return findings;
    }
}
