# Layouts

What Spyglass expects to find for each content type under each `--layout`.

- `standard` is any folder or packaged file. No folder name rules.
- `marketplace` is a submission zip with fixed folder names and art folders.

Packs are found by searching for `manifest.json` in both layouts. The marketplace layout finds the pack first, then reports a wrong name or place through the [MARKETPLACE](checks/marketplace.md) group.

Names in angle brackets vary. `<Acr>` is the content acronym: letters, digits, underscore, hyphen. `<Name>` is the content name in PascalCase with non alphanumeric characters removed. `<name>` is the same in lower case.

## Add-on

Standard. Two packs anywhere under the input, or a `.mcaddon` containing both.

```
<input>/
  <behavior pack>/
    manifest.json
    pack_icon.png
    entities/  items/  blocks/  scripts/  functions/  ...
  <resource pack>/
    manifest.json
    pack_icon.png
    textures/  models/  animations/  sounds/  texts/  ...
```

Marketplace.

```
<Name>.zip
  Content/
    behavior_packs/
      BP_<Acr>/
        manifest.json
        ...
    resource_packs/
      RP_<Acr>/
        manifest.json
        ...
  Marketing Art/
    <Name>_MarketingKeyArt.jpg
    <Name>_PartnerArt.jpg
    <Name>_MarketingScreenshot_0.jpg  to  _4.jpg or more
  Store Art/
    <name>_Thumbnail_0.jpg
    <name>_panorama_0.jpg
    <name>_packicon_0.jpg
    <name>_screenshot_0.jpg  to  _4.jpg
```

The [ADDON](checks/addon.md) group runs in every layout: creator folder layout, namespaced identifiers, size and file limits.

The [MARKETPLACE](checks/marketplace.md) group runs in the marketplace layout only. The behavior pack manifest must not declare `pack_scope` (MARKETPLACE/204). Both manifests must have `metadata.product_type` `addon` (MARKETPLACE/107). The resource pack manifest must declare `pack_scope` `world`.

## World

Standard. A world folder with `level.dat`, or a `.mctemplate` or `.mcworld`. Packs may be inside the world folder or beside it.

```
<input>/
  level.dat
  levelname.txt
  world_icon.jpeg
  world_behavior_packs.json
  world_resource_packs.json
  manifest.json                 template only
  db/
  behavior_packs/
    <pack>/
      manifest.json
  resource_packs/
    <pack>/
      manifest.json
```

Marketplace.

```
<Name>.zip
  Content/
    world_template/
      manifest.json
      level.dat
      world_icon.jpeg
      world_behavior_packs.json
      world_resource_packs.json
      db/
      behavior_packs/
        BP_<Acr>/
          manifest.json
      resource_packs/
        RP_<Acr>/
          manifest.json
    resource_packs/
      RP_<Acr>/                 standalone full conversion only, instead of the one above
    skin_pack/
      manifest.json
      skins.json
      ...                       optional
  Marketing Art/
    same as add-on
  Store Art/
    same as add-on
```

The resource pack is in exactly one of the two places. Inside `world_template` when the world needs it. Under `Content/resource_packs` when it is a full texture conversion that players can apply without a world template.

`world_behavior_packs.json` and `world_resource_packs.json` are arrays of `pack_id` and `version` pairs. Each must match the manifest header of the pack it points to.

## Skin pack

Standard. One pack, or a `.mcpack`.

```
<input>/
  manifest.json
  skins.json
  texts/
    languages.json
    en_US.lang
  <skin>.png
  <cape>.png
```

Marketplace.

```
<Name>.zip
  Content/
    skin_pack/
      manifest.json
      skins.json
      texts/
      *.png
  Marketing Art/
    <Name>_MarketingKeyArt.jpg
    <Name>_PartnerArt.jpg
  Store Art/
    <name>_Thumbnail_0.jpg
```

Skin packs need no screenshots, panorama, or pack icon in the art folders, and `MANIFEST/105` does not require `pack_icon.png` in the pack.

## Texture pack

Standard. One resource pack, or a `.mcpack`.

```
<input>/
  manifest.json
  pack_icon.png
  textures/
    blocks/  items/  entity/  ...
    terrain_texture.json
    item_texture.json
  ...
```

Marketplace.

```
<Name>.zip
  Content/
    resource_packs/
      RP_<Acr>/
        manifest.json
        ...
  Marketing Art/
    same as add-on
  Store Art/
    same as add-on
```

No behavior pack. A texture pack is expected to override at least 95 percent of vanilla block, item, and entity textures.

## Persona piece

Standard. One pack with one piece, or a `.mcpersona`. All files are directly in the root folder. `<id>` is the piece identifier: letters, digits, underscore, period, hyphen, not ending in a period.

```
<input>/
  manifest.json                 format_version 1, module type persona_piece
  <id>.meta.json                piece definition, piece_name equals <id>
  <id>.geometry.json            only when the piece has custom cubes, <id>.geo.json is also accepted
  <texture>.png or .tga         body, head, and geometry textures, lower case names
  <tintmap>.png or .tga         optional tint maps
  texts/
    languages.json
    en_US.lang                  persona.<id>.title
```

Exactly one meta file per pack. Every texture, tint map, and geometry listed in the meta must exist in the pack. The Marketplace form adds `contents.json` and `signatures.json` at the root.

Marketplace.

```
<id>.zip
  Content/
    persona/
      same files as standard
  Marketing Art/
    <id>_ApprovalSheet.png
    <id>_Walking.gif
    <id>_Running.gif
    <id>_Swimming.gif
    <id>_Crouching.gif
    <id>_SideLoad.mcpack
    <id>_BlockbenchProject.bbmodel
  Store Art/
    <id>_Thumbnail_0.png
```

The whole zip is produced by the persona export in Blockbench. Manual packaging is not allowed.

## Emote

Standard. Validated with the `persona` content type, with the same pack structure as a persona piece. Module type is still `persona_piece`. The meta `piece_type` is `persona_emote`, and an animation file replaces textures and geometry. `<id>` is lower case letters, digits, underscore, starts with `em_`, and contains a second underscore.

```
<input>/
  manifest.json                 format_version 1, module type persona_piece
  <id>.meta.json                piece_type persona_emote, animation_sources
  <id>.animation.json           format_version 1.8.0, key animation.<id>
  texts/
    languages.json
    en_US.lang                  persona.offer.title, persona.emote.chat_message, persona.emote.easter_egg
```

The animation file name must be `<id>.animation.json`, not `<id>.json`. Only these bones may be animated: `root`, `hip`, `body`, `head`, `rightArm`, `leftArm`, `rightLeg`, `leftLeg`, `rightItem`, `leftItem`.

Marketplace.

```
<id>.zip
  Content/
    persona/
      same files as standard
  Marketing Art/
    <id>.gif
    <id>_SideLoad.mcpack
    <id>_BlockbenchProject.bbmodel
  Store Art/
    <id>_thumbnail_0.png
```

Produced by the emote export in Blockbench. No approval sheet and one GIF, since emotes have no body size variants.

## Art

Checked by the [ART](checks/art.md) group under the marketplace layout.

| Folder | Role | Size | Format | DPI | Count |
|---|---|---|---|---|---|
| Store Art | Thumbnail | 800 by 450 | JPEG | 72 | 1 |
| Store Art | Screenshot | 800 by 450 | JPEG | 72 | exactly 5 |
| Store Art | Panorama | 1000 to 4000 by 450 | JPEG | 72 | 1 |
| Store Art | Pack icon | 256 by 256 | JPEG | 72 | 1 |
| Marketing Art | Key art | 1920 by 1080 | JPEG or PSD | 300 | 1 |
| Marketing Art | Screenshot | 1920 by 1080 | JPEG or PSD | 300 | 5 or more |
| Marketing Art | Partner art | 1920 by 1080 | JPEG or PSD | 300 | 1 |
| Marketing Art | Approval sheet | 5120 by 1600 | PNG | | 1, persona piece only |
| Marketing Art | Walk cycle GIFs | | GIF | | 4 for persona piece, 1 for emote |
| Store Art | Persona thumbnail | | PNG, transparent | | 1, rendered by Blockbench |

The Store Art prefix is the lower case form of the Marketing Art prefix. Marketing Art keeps its source extension, so `.psd` stays `.psd`.

## Game files

Each content type is also packaged as a file the game opens directly. Spyglass accepts all of these as `--input` under the `standard` layout.

| Content type | Extension | Root contents |
|---|---|---|
| addon | `.mcaddon` | `behavior_packs/BP_<Acr>`, `resource_packs/RP_<Acr>` |
| world | `.mctemplate` | world files at root, `behavior_packs/BP_<Acr>`, `resource_packs/RP_<Acr>` |
| world | `.mcworld` | an exported world, same root contents as `.mctemplate` |
| skin | `.mcpack` | skin pack files at root |
| texture | `.mcpack` | resource pack files at root |
| persona | `.mcpersona` | piece or emote files at root |
| any | `.zip` | the same root contents as the game file for that content type, or a Marketplace submission with `--layout marketplace` |
