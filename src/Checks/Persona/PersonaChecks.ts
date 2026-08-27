import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import AnimatedTextureInvalid from "./AnimatedTextureInvalid.js";
import BodyTextureSizeInvalid from "./BodyTextureSizeInvalid.js";
import GeometryFormatVersionInvalid from "./GeometryFormatVersionInvalid.js";
import GeometryIdentifierInvalid from "./GeometryIdentifierInvalid.js";
import GeometryNotFound from "./GeometryNotFound.js";
import GeometryTextureSizeInvalid from "./GeometryTextureSizeInvalid.js";
import GeometryUnreferenced from "./GeometryUnreferenced.js";
import GeometryVariantMissing from "./GeometryVariantMissing.js";
import HeadTextureSizeInvalid from "./HeadTextureSizeInvalid.js";
import IdentifierInvalid from "./IdentifierInvalid.js";
import MetaFieldMissing from "./MetaFieldMissing.js";
import MetaFileMissing from "./MetaFileMissing.js";
import MetaInvalid from "./MetaInvalid.js";
import ModuleTypeMismatch from "./ModuleTypeMismatch.js";
import MultipleMetaFiles from "./MultipleMetaFiles.js";
import PieceIdInvalid from "./PieceIdInvalid.js";
import PieceNameMismatch from "./PieceNameMismatch.js";
import PieceTypeNotSubmittable from "./PieceTypeNotSubmittable.js";
import PieceTypeUnknown from "./PieceTypeUnknown.js";
import SizeValueInvalid from "./SizeValueInvalid.js";
import SourcesMissing from "./SourcesMissing.js";
import TextureFormatInvalid from "./TextureFormatInvalid.js";
import TextureFramesOverLimit from "./TextureFramesOverLimit.js";
import TextureNameNotLowercase from "./TextureNameNotLowercase.js";
import TextureNotFound from "./TextureNotFound.js";
import TextureUnreferenced from "./TextureUnreferenced.js";
import TintColorInvalid from "./TintColorInvalid.js";
import TitleMissing from "./TitleMissing.js";
import ZoneOverlap from "./ZoneOverlap.js";
import ZoneUnknown from "./ZoneUnknown.js";

export default abstract class PersonaChecks {
    static readonly GROUP: CheckGroup = "PERSONA";
    static readonly META_FILE_MISSING = 101;
    static readonly META_FIELD_MISSING = 102;
    static readonly TITLE_MISSING = 103;
    static readonly SOURCES_MISSING = 104;
    static readonly GEOMETRY_VARIANT_MISSING = 105;
    static readonly META_INVALID = 201;
    static readonly PIECE_ID_INVALID = 202;
    static readonly PIECE_NAME_MISMATCH = 203;
    static readonly PIECE_TYPE_UNKNOWN = 204;
    static readonly IDENTIFIER_INVALID = 205;
    static readonly TEXTURE_NAME_NOT_LOWERCASE = 206;
    static readonly TEXTURE_FORMAT_INVALID = 207;
    static readonly BODY_TEXTURE_SIZE_INVALID = 208;
    static readonly HEAD_TEXTURE_SIZE_INVALID = 209;
    static readonly GEOMETRY_TEXTURE_SIZE_INVALID = 210;
    static readonly ANIMATED_TEXTURE_INVALID = 211;
    static readonly GEOMETRY_IDENTIFIER_INVALID = 212;
    static readonly SIZE_VALUE_INVALID = 213;
    static readonly ZONE_UNKNOWN = 214;
    static readonly MODULE_TYPE_MISMATCH = 215;
    static readonly TINT_COLOR_INVALID = 216;
    static readonly TEXTURE_NOT_FOUND = 301;
    static readonly GEOMETRY_NOT_FOUND = 302;
    static readonly TEXTURE_UNREFERENCED = 303;
    static readonly GEOMETRY_UNREFERENCED = 304;
    static readonly TEXTURE_FRAMES_OVER_LIMIT = 401;
    static readonly GEOMETRY_FORMAT_VERSION_INVALID = 501;
    static readonly MULTIPLE_META_FILES = 601;
    static readonly ZONE_OVERLAP = 602;
    static readonly PIECE_TYPE_NOT_SUBMITTABLE = 701;

    static create(): Check[] {
        return [
            new MetaFileMissing(),
            new MetaFieldMissing(),
            new TitleMissing(),
            new SourcesMissing(),
            new GeometryVariantMissing(),
            new MetaInvalid(),
            new PieceIdInvalid(),
            new PieceNameMismatch(),
            new PieceTypeUnknown(),
            new IdentifierInvalid(),
            new TextureNameNotLowercase(),
            new TextureFormatInvalid(),
            new BodyTextureSizeInvalid(),
            new HeadTextureSizeInvalid(),
            new GeometryTextureSizeInvalid(),
            new AnimatedTextureInvalid(),
            new GeometryIdentifierInvalid(),
            new SizeValueInvalid(),
            new ZoneUnknown(),
            new ModuleTypeMismatch(),
            new TintColorInvalid(),
            new TextureNotFound(),
            new GeometryNotFound(),
            new TextureUnreferenced(),
            new GeometryUnreferenced(),
            new TextureFramesOverLimit(),
            new GeometryFormatVersionInvalid(),
            new MultipleMetaFiles(),
            new ZoneOverlap(),
            new PieceTypeNotSubmittable(),
        ];
    }
}
