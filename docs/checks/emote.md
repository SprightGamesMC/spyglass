# EMOTE

An emote pack, meaning a persona pack whose meta `piece_type` is `persona_emote`: the emote meta file, the animation file it lists, and the emote strings in `en_US.lang`. Rules about the pack body itself are in [PERSONA](persona.md).

Runs for: persona. Only packs whose meta `piece_type` is `persona_emote`.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| EMOTE/101 | animation-source-missing | error | Meta has no animation_sources entry |
| EMOTE/102 | chat-message-missing | error | No persona.emote.chat_message key in en_US.lang |
| EMOTE/103 | easter-egg-missing | error | No persona.emote.easter_egg key in en_US.lang |
| EMOTE/104 | title-missing | error | No persona.offer.title key in en_US.lang |
| EMOTE/201 | animation-file-name-invalid | error | animationFile is not <id>.animation.json |
| EMOTE/202 | identifier-invalid | error | Identifier is not lower case letters, digits, underscore, starting with em_ and containing a studio prefix |
| EMOTE/203 | animation-name-mismatch | error | animation_sources name is not animation.<id> or is not a key in the animation file |
| EMOTE/204 | bone-not-allowed | error | Animation moves a bone that is not in the allowed set |
| EMOTE/205 | hold-on-last-frame-used | error | Animation loop is hold_on_last_frame |
| EMOTE/206 | animation-time-query-used | error | Animation uses query.anim_time or q.anim_time |
| EMOTE/207 | start-pose-not-neutral | error | First keyframe has rotation, position, or scale away from neutral |
| EMOTE/208 | end-pose-not-neutral | error | Last keyframe has rotation, position, or scale away from neutral |
| EMOTE/209 | piece-sources-present | error | Emote meta has texture_sources or geometry_sources |
| EMOTE/210 | chat-message-no-player-token | warning | Chat message or easter egg has no @ player token |
| EMOTE/301 | animation-file-not-found | error | animationFile refers to a file not in the pack |
| EMOTE/401 | animation-too-long | error | Animation is longer than 10 seconds |
| EMOTE/402 | root-movement-over-limit | error | Root moves above 16 on Y, below 0 on Y, or beyond plus or minus 4 on X or Z |
| EMOTE/403 | bone-scale-over-limit | error | Bone scale is outside 0.85 to 1.15 or not uniform |
| EMOTE/501 | animation-format-version-invalid | error | Animation file format_version is not 1.8.0 |
| EMOTE/601 | multiple-animations | error | Animation file defines more than one animation |
| EMOTE/701 | loop-enabled | warning | Animation has a loop key set to true |

`<id>` below is the emote identifier, the `piece_name` value.

## EMOTE/101 animation-source-missing

The emote meta file has no `animation_sources` entry, so the game has no animation to play.

Fix: add an `animation_sources` entry that refers to the emote animation.

## EMOTE/102 chat-message-missing

`en_US.lang` has no `persona.emote.chat_message` key, the text shown in chat when the emote plays.

Fix: add a `persona.emote.chat_message` line.

## EMOTE/103 easter-egg-missing

`en_US.lang` has no `persona.emote.easter_egg` key.

Fix: add a `persona.emote.easter_egg` line.

## EMOTE/104 title-missing

`en_US.lang` has no `persona.offer.title` key, the display name of the emote.

Fix: add a `persona.offer.title` line.

## EMOTE/201 animation-file-name-invalid

The `animationFile` value is not `<id>.animation.json`. Some released first party emotes use `<id>.json`, which is still reported.

Fix: rename the animation file to `<id>.animation.json` and set `animationFile` to the same name.

## EMOTE/202 identifier-invalid

`piece_name` must use only lower case letters, digits, and underscore, must start with `em_`, and must contain another underscore after `em_` separating the studio prefix from the name. Both parts must be non empty. The `em_` prefix is added by the persona export in Blockbench.

Fix: set `piece_name` to `em_<studio>_<name>`.

## EMOTE/203 animation-name-mismatch

The name in `animation_sources` is not `animation.<id>`, or that name is not a key in the `animations` object of the animation file.

Fix: set the name to `animation.<id>` and define an animation with that exact key.

## EMOTE/204 bone-not-allowed

The animation moves a bone outside the allowed set: `root`, `hip`, `body`, `head`, `rightArm`, `leftArm`, `rightLeg`, `leftLeg`, `rightItem`, `leftItem`.

Fix: remove or rename the bone in the animation file.

## EMOTE/205 hold-on-last-frame-used

The animation `loop` value is `hold_on_last_frame`. An emote must return the player to the neutral pose when it ends.

Fix: remove the `loop` key or set another value.

## EMOTE/206 animation-time-query-used

The animation file uses `query.anim_time` or `q.anim_time`.

Fix: replace those expressions with fixed keyframe values.

## EMOTE/207 start-pose-not-neutral

The first keyframe of a bone is not neutral. Neutral is rotation `0 0 0`, root position `0 0 0`, and scale `1`. Values are read from the first keyframe of each channel after sorting keyframes by time.

Fix: set the first rotation, position, and scale keyframes to the neutral values.

## EMOTE/208 end-pose-not-neutral

The last keyframe of a bone is not neutral. Neutral is rotation `0 0 0`, root position `0 0 0`, and scale `1`. Values are read from the last keyframe of each channel after sorting keyframes by time.

Fix: set the last rotation, position, and scale keyframes to the neutral values.

## EMOTE/209 piece-sources-present

The emote meta file contains `texture_sources` or `geometry_sources`. Those keys are for persona pieces.

Fix: remove both keys from the emote meta file.

## EMOTE/210 chat-message-no-player-token

`persona.emote.chat_message` or `persona.emote.easter_egg` has no `@` token, which is replaced by the player name.

Fix: add `@` where the player name should appear.

## EMOTE/301 animation-file-not-found

The file named by `animationFile` is not in the pack.

Fix: add the animation file, or correct the `animationFile` value.

## EMOTE/401 animation-too-long

The animation is longer than 10 seconds. The length is `animation_length` when present, otherwise the time of the last keyframe.

Fix: shorten the animation and update `animation_length` to match.

## EMOTE/402 root-movement-over-limit

A `root` position keyframe goes above `16` or below `0` on Y, or beyond plus or minus `4` on X or Z. Only keyframe values are read, not interpolated values between them.

Fix: adjust the `root` position keyframes to stay inside those limits.

## EMOTE/403 bone-scale-over-limit

A bone scale keyframe is not uniform on all three axes, or is outside `0.85` to `1.15`. Only keyframe values are read, not interpolated values between them.

Fix: use the same value on X, Y, and Z, inside that range.

## EMOTE/501 animation-format-version-invalid

The `format_version` of the animation file is not `1.8.0`.

Fix: set `format_version` to `1.8.0`.

## EMOTE/601 multiple-animations

The `animations` object has more than one key. The file must define exactly one animation.

Fix: remove the extra animations.

## EMOTE/701 loop-enabled

The animation has a `loop` key set to `true`. The persona export in Blockbench removes `loop`, and released first party emotes sometimes contain it, so this is a warning.

Fix: remove the `loop` key, or set it to `false`.
