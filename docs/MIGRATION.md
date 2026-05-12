# Migration Guide

The goal is simple: copy this project folder to another computer and keep working without hunting for scattered source/data folders.

## What Is Bundled Now

The project includes a local source bundle under:

```text
external/sources/
```

Current bundle contents:

- `external/sources/ref___data`: canonical `gmsv-data` gameplay data. Generated world/debug output labels this as `gmsv-data`.
- `external/sources/client-assets`: client maps, tile binaries, palettes, and related assets.
- `external/sources/gmsv`: original game server runtime source.
- `external/sources/client-source`: original 8.5 client source.
- `external/sources/saac-data`: 2016 SAAC data reference.
- `external/sources/saac-source`: original SAAC source.

`external/sources/` is intentionally ignored by git because it contains very large binary resources, including client tile data. It is still part of the local project folder and will be included by the transfer archive script.

## Recommended Transfer

From this directory:

```bash
node scripts/check-resources.mjs
node scripts/package-transfer.mjs
```

Then copy:

```text
external/transfer/stoneage-web-workspace.tar.gz
```

to the new computer and extract it.

## New Computer Setup

Inside the extracted project:

```bash
npm install
node scripts/check-resources.mjs
npm run dev
```

Open the Wrangler local URL.

## Regenerating World Data

The scripts default to the bundled local copies:

```bash
npm run build:world
```

If you want to use external copies instead, set:

```bash
SA_REF_DATA=/path/to/ref___data
SA_CLIENT_ASSET_ROOT=/path/to/client-assets
```

Then run `npm run build:world`.

## GitHub Note

Git tracks the app, generated runtime assets, scripts, and documentation. It does not track `external/sources/` or `public/debug/`.

For a full "everything included" move, use the transfer archive or copy the full project folder from Finder/rsync.
