# Hush UI Design Package

This repository contains the local Hush product UI design board.

## What This Is

This is a shareable design package for reviewing and editing the Hush UI locally.

- **App UI is on the left**
- **Keyboard UI is on the right**
- The keyboard side is only for fast dictation and insertion.
- The app side owns setup, settings, dictionary, history, diagnostics, recovery, storage, and support.

## Main File

Open this file in a real local design app:

`Hush_Elegant_Product_Design_V2_editable.svg`

Recommended editors:

1. **Lunacy** - easiest free option to try first.
2. **Sketch** - best serious Mac/iOS product-design workflow.
3. **Inkscape** - useful for direct SVG/vector edits.
4. **Penpot self-hosted** - useful later for a local Figma-like team workflow.

## Files

- `Hush_Elegant_Product_Design_V2_editable.svg` - main editable design file.
- `index.html` - local preview page and file launcher.
- `screen_manifest.json` - list of named screen groups.
- `Hush_Elegant_Product_Design_V2_reference_preview.png` - reference preview image.
- `CLIENT_CHANGE_REQUEST_GUIDE.md` - instructions for clients who want to request changes.
- `generate_hush_design.js` - source generator for Codex/Claude to regenerate the editable SVG.

## Instructions For Clients

Read `CLIENT_CHANGE_REQUEST_GUIDE.md` first.

Use this workflow when requesting design changes:

1. Open `Hush_Elegant_Product_Design_V2_editable.svg` in Lunacy, Sketch, or Inkscape.
2. Select the area you want changed.
3. Take a screenshot of that area.
4. Describe the change in plain language.
5. Send the screenshot and note to Ali/Codex/Claude.

Good examples:

- “Remove this button from the keyboard UI.”
- “This setting should be in the app UI, not the keyboard UI.”
- “Make this microphone icon clearer.”
- “Move this idea to the app settings screen.”
- “This screen feels too crowded; simplify it.”

## Instructions For Codex Or Claude

When applying client feedback:

1. Treat `Hush_Elegant_Product_Design_V2_editable.svg` as the client-facing design artifact.
2. Prefer updating `generate_hush_design.js`, then run `node generate_hush_design.js` to regenerate the SVG.
3. Keep the product rule intact:
   - Keyboard UI: mic, typing, recording status, live transcript/current result, retry recent failed audio.
   - App UI: setup, settings, dictionary, full history, audio detail, diagnostics, storage/recovery, support.
4. Do not put app navigation, settings, dictionary, or diagnostics inside the keyboard UI.
5. Keep changes visible and simple enough for non-technical client review.

## Current Workflow

The old custom HTML selector/editor workflow is retired. Use real local design tools instead.

The browser `index.html` is only for previewing the board and opening package files.
