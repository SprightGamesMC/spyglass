import GenericTerms from "../../Data/GenericTerms.js";
import AddonLimits from "./AddonLimits.js";

export default abstract class AddonNaming {
    static readonly TOKEN_SEPARATOR = "_";
    static readonly NAMESPACE_SEPARATOR = ":";
    static readonly PREFIX_SEPARATOR = ".";

    static isNamespaced(name: string): boolean {
        const tokens = name.split(AddonNaming.TOKEN_SEPARATOR);

        if (tokens.length < 2) {
            return false;
        }

        const minimum = AddonLimits.NAMESPACE_TOKEN_MINIMUM_LENGTH;

        return tokens[0].length >= minimum && tokens[1].length >= minimum;
    }

    static isNamespacedIdentifier(identifier: string): boolean {
        const parts = identifier.split(AddonNaming.NAMESPACE_SEPARATOR);

        if (parts.length !== 2) {
            return false;
        }

        return AddonNaming.isNamespaced(parts[0]);
    }

    static isNamespacedCatalogKey(key: string): boolean {
        if (key.includes(AddonNaming.NAMESPACE_SEPARATOR)) {
            return AddonNaming.isNamespacedIdentifier(key);
        }

        if (key.split(AddonNaming.TOKEN_SEPARATOR).length < AddonLimits.CATALOG_KEY_TOKEN_MINIMUM_COUNT) {
            return false;
        }

        return AddonNaming.isNamespaced(key);
    }

    static isUniqueForm(name: string): boolean {
        return AddonLimits.UNIQUE_FORM.test(name);
    }

    static isGenericMaterialName(name: string): boolean {
        const tokens = name.split(AddonNaming.TOKEN_SEPARATOR);

        if (tokens.length < AddonLimits.MATERIAL_TOKEN_MINIMUM_COUNT) {
            return true;
        }

        return GenericTerms.isGeneric(tokens[0]);
    }

    static firstToken(name: string): string {
        return name.split(AddonNaming.TOKEN_SEPARATOR)[0];
    }
}
