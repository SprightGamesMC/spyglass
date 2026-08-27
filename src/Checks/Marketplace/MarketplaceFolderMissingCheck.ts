import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import MarketplaceFolders from "./MarketplaceFolders.js";

export default abstract class MarketplaceFolderMissingCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const expected = this.expectedFolder();

        if (MarketplaceFolders.hasFolder(context.model, expected)) {
            return [];
        }

        const found = MarketplaceFolders.findFolderIgnoringCase(context.model, expected);

        if (found !== undefined) {
            return [this.finding("Folder " + found + " is named differently from the expected " + expected, found)];
        }

        return [this.finding("No " + expected + " folder found")];
    }

    protected abstract expectedFolder(): string;
}
