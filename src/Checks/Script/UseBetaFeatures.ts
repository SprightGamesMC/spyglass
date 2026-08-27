import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import ScriptChecks from "./ScriptChecks.js";
import ScriptLimits from "./ScriptLimits.js";

export default class UseBetaFeatures extends Check {
    readonly definition: CheckDefinition = {
        group: ScriptChecks.GROUP,
        number: ScriptChecks.USE_BETA_FEATURES,
        slug: "use-beta-features",
        severity: "error",
        description: "use_beta_features is true",
    };

    private static collectTrueFlags(value: JsonValue | undefined, path: string, output: string[]): void {
        if (JsonLoader.isArray(value)) {
            value.forEach((entry, index) => UseBetaFeatures.collectTrueFlags(entry, path + "[" + index + "]", output));

            return;
        }

        if (!JsonLoader.isObject(value)) {
            return;
        }

        for (const [key, entry] of Object.entries(value)) {
            const childPath = path === "" ? key : path + "." + key;

            if (key === ScriptLimits.USE_BETA_FEATURES_KEY && entry === true) {
                output.push(childPath);
                continue;
            }

            UseBetaFeatures.collectTrueFlags(entry, childPath, output);
        }
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== ScriptLimits.PACK_TYPE) {
                continue;
            }

            findings.push(...(await this.checkManifest(context, pack)));
        }

        for (const { pack, item } of PackItemLoader.select(context.model, ScriptLimits.BETA_FEATURE_FILE_KINDS, ScriptLimits.PACK_TYPE)) {
            const value = await context.loaders.json.readValue(item.path);

            findings.push(...this.report(value, item.path, pack.root));
        }

        return findings;
    }

    private async checkManifest(context: CheckContext, pack: Pack): Promise<Finding[]> {
        const manifest = await ManifestLoader.read(context.loaders, pack);
        const paths: string[] = [];

        if (JsonLoader.get(manifest, ScriptLimits.USE_BETA_FEATURES_KEY) === true) {
            paths.push(ScriptLimits.USE_BETA_FEATURES_KEY);
        }

        if (JsonLoader.get(manifest, "header", ScriptLimits.USE_BETA_FEATURES_KEY) === true) {
            paths.push("header." + ScriptLimits.USE_BETA_FEATURES_KEY);
        }

        return paths.map((field) => this.finding("use_beta_features is true", pack.manifestPath, pack.root, { field }));
    }

    private report(value: JsonValue | undefined, path: string, packRoot: string): Finding[] {
        const fields: string[] = [];

        UseBetaFeatures.collectTrueFlags(value, "", fields);

        return fields.map((field) => this.finding("use_beta_features is true", path, packRoot, { field }));
    }
}
