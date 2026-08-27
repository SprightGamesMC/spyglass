import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import CatalogResourceUnused from "./CatalogResourceUnused.js";
import CatalogVanillaOverride from "./CatalogVanillaOverride.js";
import DeprecatedOverride from "./DeprecatedOverride.js";

export default abstract class BlockChecks {
    static readonly GROUP: CheckGroup = "BLOCK";
    static readonly CATALOG_RESOURCE_UNUSED = 301;
    static readonly DEPRECATED_OVERRIDE = 501;
    static readonly CATALOG_VANILLA_OVERRIDE = 601;

    static create(): Check[] {
        return [new CatalogResourceUnused(), new DeprecatedOverride(), new CatalogVanillaOverride()];
    }
}
