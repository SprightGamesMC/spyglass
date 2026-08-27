import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import ArchiveFolderNotAllowed from "./ArchiveFolderNotAllowed.js";
import BehaviorPackHasPackScope from "./BehaviorPackHasPackScope.js";
import ContentFolderMissing from "./ContentFolderMissing.js";
import ManifestFileNameCase from "./ManifestFileNameCase.js";
import MinEngineVersionsDiffer from "./MinEngineVersionsDiffer.js";
import PackFolderAcronymMismatch from "./PackFolderAcronymMismatch.js";
import PackFolderCountInvalid from "./PackFolderCountInvalid.js";
import PackFolderNameInvalid from "./PackFolderNameInvalid.js";
import PackNotReferenced from "./PackNotReferenced.js";
import PackVersionsDiffer from "./PackVersionsDiffer.js";
import PersonaFolderMissing from "./PersonaFolderMissing.js";
import ProductTypeMissing from "./ProductTypeMissing.js";
import ResourcePackFolderMissing from "./ResourcePackFolderMissing.js";
import SkinPackFolderMissing from "./SkinPackFolderMissing.js";
import WorldPackReferenceFileMissing from "./WorldPackReferenceFileMissing.js";
import WorldPackReferenceMismatch from "./WorldPackReferenceMismatch.js";
import WorldResourcePackInBothLocations from "./WorldResourcePackInBothLocations.js";
import WorldTemplateMissing from "./WorldTemplateMissing.js";

export default abstract class MarketplaceChecks {
    static readonly GROUP: CheckGroup = "MARKETPLACE";
    static readonly CONTENT_FOLDER_MISSING = 101;
    static readonly WORLD_TEMPLATE_MISSING = 102;
    static readonly SKIN_PACK_FOLDER_MISSING = 103;
    static readonly RESOURCE_PACK_FOLDER_MISSING = 104;
    static readonly PERSONA_FOLDER_MISSING = 105;
    static readonly WORLD_PACK_REFERENCE_FILE_MISSING = 106;
    static readonly PRODUCT_TYPE_MISSING = 107;
    static readonly PACK_FOLDER_NAME_INVALID = 201;
    static readonly PACK_FOLDER_ACRONYM_MISMATCH = 202;
    static readonly MANIFEST_FILE_NAME_CASE = 203;
    static readonly BEHAVIOR_PACK_HAS_PACK_SCOPE = 204;
    static readonly WORLD_RESOURCE_PACK_IN_BOTH_LOCATIONS = 205;
    static readonly PACK_VERSIONS_DIFFER = 206;
    static readonly MIN_ENGINE_VERSIONS_DIFFER = 207;
    static readonly WORLD_PACK_REFERENCE_MISMATCH = 208;
    static readonly PACK_FOLDER_COUNT_INVALID = 209;
    static readonly PACK_NOT_REFERENCED = 301;
    static readonly ARCHIVE_FOLDER_NOT_ALLOWED = 701;

    static create(): Check[] {
        return [
            new ContentFolderMissing(),
            new WorldTemplateMissing(),
            new SkinPackFolderMissing(),
            new ResourcePackFolderMissing(),
            new PersonaFolderMissing(),
            new WorldPackReferenceFileMissing(),
            new ProductTypeMissing(),
            new PackFolderNameInvalid(),
            new PackFolderAcronymMismatch(),
            new ManifestFileNameCase(),
            new BehaviorPackHasPackScope(),
            new WorldResourcePackInBothLocations(),
            new PackVersionsDiffer(),
            new MinEngineVersionsDiffer(),
            new WorldPackReferenceMismatch(),
            new PackFolderCountInvalid(),
            new PackNotReferenced(),
            new ArchiveFolderNotAllowed(),
        ];
    }
}
