import type { ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import Check from "../Check.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtImages from "./ArtImages.js";

export default abstract class ArtImageSizeCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of ArtFileRoles.classifyAll(context.model)) {
            if (!this.selects(entry)) {
                continue;
            }

            const metadata = await ArtImages.read(context.loaders, entry.file);

            if (metadata === undefined || this.sizeIsValid(metadata)) {
                continue;
            }

            findings.push(
                this.finding("Size is " + ArtImages.describeSize(metadata) + ", expected " + this.expectedSize(), entry.file.path)
            );
        }

        return findings;
    }

    protected abstract selects(entry: ClassifiedArtFile): boolean;

    protected abstract sizeIsValid(metadata: ImageMetadata): boolean;

    protected abstract expectedSize(): string;
}
