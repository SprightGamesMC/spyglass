import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import AssetUnused from "./AssetUnused.js";
import ExperimentalTypeNotAllowed from "./ExperimentalTypeNotAllowed.js";
import ExtensionNotAllowed from "./ExtensionNotAllowed.js";
import FileCountOverLimit from "./FileCountOverLimit.js";
import FileNameBlocked from "./FileNameBlocked.js";
import FileOutsidePack from "./FileOutsidePack.js";
import LinkNotFound from "./LinkNotFound.js";
import LinksToVanilla from "./LinksToVanilla.js";
import ManifestMissing from "./ManifestMissing.js";
import MultipleManifests from "./MultipleManifests.js";
import OverridesProtectedVanillaAsset from "./OverridesProtectedVanillaAsset.js";
import SizeOverLimit from "./SizeOverLimit.js";
import UnknownJson from "./UnknownJson.js";
import VanillaCopy from "./VanillaCopy.js";

export default abstract class PackChecks {
    static readonly GROUP: CheckGroup = "PACK";
    static readonly MANIFEST_MISSING = 101;
    static readonly EXTENSION_NOT_ALLOWED = 201;
    static readonly UNKNOWN_JSON = 202;
    static readonly FILE_NAME_BLOCKED = 203;
    static readonly FILE_OUTSIDE_PACK = 204;
    static readonly ASSET_UNUSED = 301;
    static readonly LINK_NOT_FOUND = 302;
    static readonly LINKS_TO_VANILLA = 303;
    static readonly SIZE_OVER_LIMIT = 401;
    static readonly FILE_COUNT_OVER_LIMIT = 402;
    static readonly MULTIPLE_MANIFESTS = 601;
    static readonly OVERRIDES_PROTECTED_VANILLA_ASSET = 602;
    static readonly VANILLA_COPY = 603;
    static readonly EXPERIMENTAL_TYPE_NOT_ALLOWED = 701;

    static create(): Check[] {
        return [
            new ManifestMissing(),
            new ExtensionNotAllowed(),
            new UnknownJson(),
            new FileNameBlocked(),
            new FileOutsidePack(),
            new AssetUnused(),
            new LinkNotFound(),
            new LinksToVanilla(),
            new SizeOverLimit(),
            new FileCountOverLimit(),
            new MultipleManifests(),
            new OverridesProtectedVanillaAsset(),
            new VanillaCopy(),
            new ExperimentalTypeNotAllowed(),
        ];
    }
}
