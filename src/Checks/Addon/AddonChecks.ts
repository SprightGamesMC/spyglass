import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BehaviorPackMissing from "./BehaviorPackMissing.js";
import BpToRpDependencyMismatch from "./BpToRpDependencyMismatch.js";
import BpToRpDependencyMissing from "./BpToRpDependencyMissing.js";
import CatalogKeyNotNamespaced from "./CatalogKeyNotNamespaced.js";
import CreatorFolderNameGeneric from "./CreatorFolderNameGeneric.js";
import CreatorFolderTooManySubfolders from "./CreatorFolderTooManySubfolders.js";
import DefinitionIdentifierNotNamespaced from "./DefinitionIdentifierNotNamespaced.js";
import FileCountOverLimit from "./FileCountOverLimit.js";
import FileDirectlyInCreatorFolder from "./FileDirectlyInCreatorFolder.js";
import FileDirectlyInTypeFolder from "./FileDirectlyInTypeFolder.js";
import IdentifierFormInvalid from "./IdentifierFormInvalid.js";
import IdentifierNotNamespaced from "./IdentifierNotNamespaced.js";
import MaterialIdentifierInvalid from "./MaterialIdentifierInvalid.js";
import MultipleBehaviorPacks from "./MultipleBehaviorPacks.js";
import MultipleBpToRpDependencies from "./MultipleBpToRpDependencies.js";
import MultipleResourcePacks from "./MultipleResourcePacks.js";
import MultipleRpToBpDependencies from "./MultipleRpToBpDependencies.js";
import PathNotNamespaced from "./PathNotNamespaced.js";
import RuntimeIdentifierVanilla from "./RuntimeIdentifierVanilla.js";
import ResourcePackMissing from "./ResourcePackMissing.js";
import ResourcePackScopeMissing from "./ResourcePackScopeMissing.js";
import RpToBpDependencyMismatch from "./RpToBpDependencyMismatch.js";
import RpToBpDependencyMissing from "./RpToBpDependencyMissing.js";
import SizeOverLimit from "./SizeOverLimit.js";
import StructuresFolderNameNotUnique from "./StructuresFolderNameNotUnique.js";
import StructuresTooManySubfolders from "./StructuresTooManySubfolders.js";
import TextureTotalOverBaseLimit from "./TextureTotalOverBaseLimit.js";
import TooManyTextureHandles from "./TooManyTextureHandles.js";
import UiNotAllowed from "./UiNotAllowed.js";
import VanillaContentOverride from "./VanillaContentOverride.js";
import CatalogVanillaOverride from "./CatalogVanillaOverride.js";
import VanillaDimensionChunkData from "./VanillaDimensionChunkData.js";
import WorldImpactingCommand from "./WorldImpactingCommand.js";

export default abstract class AddonChecks {
    static readonly GROUP: CheckGroup = "ADDON";
    static readonly BEHAVIOR_PACK_MISSING = 101;
    static readonly RESOURCE_PACK_MISSING = 102;
    static readonly BP_TO_RP_DEPENDENCY_MISSING = 103;
    static readonly RP_TO_BP_DEPENDENCY_MISSING = 104;
    static readonly FILE_DIRECTLY_IN_TYPE_FOLDER = 201;
    static readonly FILE_DIRECTLY_IN_CREATOR_FOLDER = 202;
    static readonly CREATOR_FOLDER_NAME_GENERIC = 203;
    static readonly STRUCTURES_FOLDER_NAME_NOT_UNIQUE = 204;
    static readonly IDENTIFIER_FORM_INVALID = 205;
    static readonly IDENTIFIER_NOT_NAMESPACED = 206;
    static readonly DEFINITION_IDENTIFIER_NOT_NAMESPACED = 207;
    static readonly MATERIAL_IDENTIFIER_INVALID = 208;
    static readonly RESOURCE_PACK_SCOPE_MISSING = 209;
    static readonly CATALOG_KEY_NOT_NAMESPACED = 210;
    static readonly PATH_NOT_NAMESPACED = 211;
    static readonly RUNTIME_IDENTIFIER_VANILLA = 212;
    static readonly BP_TO_RP_DEPENDENCY_MISMATCH = 301;
    static readonly RP_TO_BP_DEPENDENCY_MISMATCH = 302;
    static readonly CREATOR_FOLDER_TOO_MANY_SUBFOLDERS = 401;
    static readonly STRUCTURES_TOO_MANY_SUBFOLDERS = 402;
    static readonly SIZE_OVER_LIMIT = 403;
    static readonly FILE_COUNT_OVER_LIMIT = 404;
    static readonly TOO_MANY_TEXTURE_HANDLES = 405;
    static readonly TEXTURE_TOTAL_OVER_BASE_LIMIT = 406;
    static readonly MULTIPLE_BEHAVIOR_PACKS = 601;
    static readonly MULTIPLE_RESOURCE_PACKS = 602;
    static readonly MULTIPLE_BP_TO_RP_DEPENDENCIES = 603;
    static readonly MULTIPLE_RP_TO_BP_DEPENDENCIES = 604;
    static readonly VANILLA_CONTENT_OVERRIDE = 701;
    static readonly UI_NOT_ALLOWED = 702;
    static readonly WORLD_IMPACTING_COMMAND = 703;
    static readonly VANILLA_DIMENSION_CHUNK_DATA = 704;
    static readonly CATALOG_VANILLA_OVERRIDE = 705;

    static create(): Check[] {
        return [
            new BehaviorPackMissing(),
            new ResourcePackMissing(),
            new BpToRpDependencyMissing(),
            new RpToBpDependencyMissing(),
            new FileDirectlyInTypeFolder(),
            new FileDirectlyInCreatorFolder(),
            new CreatorFolderNameGeneric(),
            new StructuresFolderNameNotUnique(),
            new IdentifierFormInvalid(),
            new IdentifierNotNamespaced(),
            new DefinitionIdentifierNotNamespaced(),
            new MaterialIdentifierInvalid(),
            new ResourcePackScopeMissing(),
            new CatalogKeyNotNamespaced(),
            new PathNotNamespaced(),
            new RuntimeIdentifierVanilla(),
            new BpToRpDependencyMismatch(),
            new RpToBpDependencyMismatch(),
            new CreatorFolderTooManySubfolders(),
            new StructuresTooManySubfolders(),
            new SizeOverLimit(),
            new FileCountOverLimit(),
            new TooManyTextureHandles(),
            new TextureTotalOverBaseLimit(),
            new MultipleBehaviorPacks(),
            new MultipleResourcePacks(),
            new MultipleBpToRpDependencies(),
            new MultipleRpToBpDependencies(),
            new VanillaContentOverride(),
            new CatalogVanillaOverride(),
            new UiNotAllowed(),
            new WorldImpactingCommand(),
            new VanillaDimensionChunkData(),
        ];
    }
}
