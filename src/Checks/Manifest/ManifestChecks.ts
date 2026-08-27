import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BaseGameVersionNotApplicable from "./BaseGameVersionNotApplicable.js";
import CapabilitiesOnBehaviorPack from "./CapabilitiesOnBehaviorPack.js";
import CapabilityInvalid from "./CapabilityInvalid.js";
import DependencyIdentifierAmbiguous from "./DependencyIdentifierAmbiguous.js";
import DependencyIdentifierMissing from "./DependencyIdentifierMissing.js";
import DependencyNotFound from "./DependencyNotFound.js";
import FormatVersion1NotAllowed from "./FormatVersion1NotAllowed.js";
import FormatVersionInvalid from "./FormatVersionInvalid.js";
import HeaderFieldMissing from "./HeaderFieldMissing.js";
import LockTemplateOptionsNotApplicable from "./LockTemplateOptionsNotApplicable.js";
import MinEngineVersionAboveCurrent from "./MinEngineVersionAboveCurrent.js";
import MinEngineVersionBelowCurrent from "./MinEngineVersionBelowCurrent.js";
import MinEngineVersionTooHighForFormat1 from "./MinEngineVersionTooHighForFormat1.js";
import ModuleNameNotAllowed from "./ModuleNameNotAllowed.js";
import ModuleTypeInvalid from "./ModuleTypeInvalid.js";
import ModuleVersionBelowMinimum from "./ModuleVersionBelowMinimum.js";
import MultiplePackIcons from "./MultiplePackIcons.js";
import MultipleWorldTemplateModules from "./MultipleWorldTemplateModules.js";
import PackIconInvalidImage from "./PackIconInvalidImage.js";
import PackIconInvalidSize from "./PackIconInvalidSize.js";
import PackIconMissing from "./PackIconMissing.js";
import PackScopeInvalid from "./PackScopeInvalid.js";
import PbrCapabilityMissing from "./PbrCapabilityMissing.js";
import PbrMinEngineVersionTooLow from "./PbrMinEngineVersionTooLow.js";
import SchemaInvalid from "./SchemaInvalid.js";
import ScriptModuleUuidOutdated from "./ScriptModuleUuidOutdated.js";
import SettingDefaultInvalid from "./SettingDefaultInvalid.js";
import SettingFieldMissing from "./SettingFieldMissing.js";
import SettingNameDuplicate from "./SettingNameDuplicate.js";
import SettingNameNotNamespaced from "./SettingNameNotNamespaced.js";
import SettingOptionsDuplicate from "./SettingOptionsDuplicate.js";
import SettingOptionsTooFew from "./SettingOptionsTooFew.js";
import SettingRangeInvalid from "./SettingRangeInvalid.js";
import SettingTypeInvalid from "./SettingTypeInvalid.js";
import StringVersionRequiresFormat3 from "./StringVersionRequiresFormat3.js";
import SubpackFolderDuplicate from "./SubpackFolderDuplicate.js";
import SubpackNameDuplicate from "./SubpackNameDuplicate.js";
import SubpacksNotApplicable from "./SubpacksNotApplicable.js";
import UuidDuplicate from "./UuidDuplicate.js";
import UuidInvalid from "./UuidInvalid.js";
import VersionInvalid from "./VersionInvalid.js";

export default abstract class ManifestChecks {
    static readonly GROUP: CheckGroup = "MANIFEST";
    static readonly HEADER_FIELD_MISSING = 101;
    static readonly DEPENDENCY_IDENTIFIER_MISSING = 102;
    static readonly PBR_CAPABILITY_MISSING = 103;
    static readonly SETTING_FIELD_MISSING = 104;
    static readonly PACK_ICON_MISSING = 105;
    static readonly SCHEMA_INVALID = 201;
    static readonly FORMAT_VERSION_INVALID = 202;
    static readonly UUID_INVALID = 203;
    static readonly PACK_SCOPE_INVALID = 204;
    static readonly MIN_ENGINE_VERSION_TOO_HIGH_FOR_FORMAT_1 = 205;
    static readonly STRING_VERSION_REQUIRES_FORMAT_3 = 206;
    static readonly BASE_GAME_VERSION_NOT_APPLICABLE = 207;
    static readonly LOCK_TEMPLATE_OPTIONS_NOT_APPLICABLE = 208;
    static readonly MODULE_TYPE_INVALID = 209;
    static readonly DEPENDENCY_IDENTIFIER_AMBIGUOUS = 210;
    static readonly MODULE_NAME_NOT_ALLOWED = 211;
    static readonly VERSION_INVALID = 212;
    static readonly CAPABILITY_INVALID = 213;
    static readonly SUBPACKS_NOT_APPLICABLE = 214;
    static readonly SETTING_TYPE_INVALID = 215;
    static readonly SETTING_RANGE_INVALID = 216;
    static readonly SETTING_DEFAULT_INVALID = 217;
    static readonly SETTING_NAME_NOT_NAMESPACED = 218;
    static readonly PACK_ICON_INVALID_IMAGE = 219;
    static readonly PACK_ICON_INVALID_SIZE = 220;
    static readonly DEPENDENCY_NOT_FOUND = 301;
    static readonly SETTING_OPTIONS_TOO_FEW = 401;
    static readonly FORMAT_VERSION_1_NOT_ALLOWED = 501;
    static readonly MIN_ENGINE_VERSION_BELOW_CURRENT = 502;
    static readonly MIN_ENGINE_VERSION_ABOVE_CURRENT = 503;
    static readonly MODULE_VERSION_BELOW_MINIMUM = 504;
    static readonly PBR_MIN_ENGINE_VERSION_TOO_LOW = 505;
    static readonly SCRIPT_MODULE_UUID_OUTDATED = 506;
    static readonly UUID_DUPLICATE = 601;
    static readonly MULTIPLE_WORLD_TEMPLATE_MODULES = 602;
    static readonly SUBPACK_FOLDER_DUPLICATE = 603;
    static readonly SUBPACK_NAME_DUPLICATE = 604;
    static readonly SETTING_NAME_DUPLICATE = 605;
    static readonly SETTING_OPTIONS_DUPLICATE = 606;
    static readonly MULTIPLE_PACK_ICONS = 607;
    static readonly CAPABILITIES_ON_BEHAVIOR_PACK = 701;

    static create(): Check[] {
        return [
            new HeaderFieldMissing(),
            new DependencyIdentifierMissing(),
            new PbrCapabilityMissing(),
            new SettingFieldMissing(),
            new PackIconMissing(),
            new SchemaInvalid(),
            new FormatVersionInvalid(),
            new UuidInvalid(),
            new PackScopeInvalid(),
            new MinEngineVersionTooHighForFormat1(),
            new StringVersionRequiresFormat3(),
            new BaseGameVersionNotApplicable(),
            new LockTemplateOptionsNotApplicable(),
            new ModuleTypeInvalid(),
            new DependencyIdentifierAmbiguous(),
            new ModuleNameNotAllowed(),
            new VersionInvalid(),
            new CapabilityInvalid(),
            new SubpacksNotApplicable(),
            new SettingTypeInvalid(),
            new SettingRangeInvalid(),
            new SettingDefaultInvalid(),
            new SettingNameNotNamespaced(),
            new PackIconInvalidImage(),
            new PackIconInvalidSize(),
            new DependencyNotFound(),
            new SettingOptionsTooFew(),
            new FormatVersion1NotAllowed(),
            new MinEngineVersionBelowCurrent(),
            new MinEngineVersionAboveCurrent(),
            new ModuleVersionBelowMinimum(),
            new PbrMinEngineVersionTooLow(),
            new ScriptModuleUuidOutdated(),
            new UuidDuplicate(),
            new MultipleWorldTemplateModules(),
            new SubpackFolderDuplicate(),
            new SubpackNameDuplicate(),
            new SettingNameDuplicate(),
            new SettingOptionsDuplicate(),
            new MultiplePackIcons(),
            new CapabilitiesOnBehaviorPack(),
        ];
    }
}
