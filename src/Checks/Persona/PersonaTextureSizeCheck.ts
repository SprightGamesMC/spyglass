import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";

export default abstract class PersonaTextureSizeCheck extends Check {
    protected abstract readonly head: boolean;
    protected abstract readonly expectedWidth: number;
    protected abstract readonly label: string;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const sources = PersonaLoader.textureSources(data.meta);
            const images = await PersonaLoader.imageSources(
                context,
                data,
                sources,
                (entry) => PersonaLoader.isHeadTexture(entry) === this.head
            );

            for (const image of images) {
                if (image.metadata.width === this.expectedWidth) {
                    continue;
                }

                findings.push(
                    this.finding(
                        this.label + " texture " + image.name + " is " + image.metadata.width + " wide, expected " + this.expectedWidth,
                        image.item.path,
                        data.pack.root,
                        { field: image.field }
                    )
                );
            }
        }

        return findings;
    }
}
