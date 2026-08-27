import type { Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import JsonKeys from "../../Data/JsonKeys.js";
import Check from "../Check.js";

export default abstract class PersonaFormatVersionCheck extends Check {
    protected abstract readonly label: string;
    protected abstract readonly expectedVersion: string;

    protected formatVersionFinding(root: JsonObject, path: string, packRoot: string): Finding | undefined {
        const version = root[JsonKeys.FORMAT_VERSION];

        if (version === this.expectedVersion) {
            return undefined;
        }

        const actual = version === undefined ? "no " + JsonKeys.FORMAT_VERSION : JsonKeys.FORMAT_VERSION + " " + String(version);

        return this.finding(this.label + " file has " + actual + ", expected " + this.expectedVersion, path, packRoot, {
            field: JsonKeys.FORMAT_VERSION,
        });
    }
}
