# External Resources

This directory records source/data trees that are needed to rebuild the project on a new computer.

Tracked files here are small manifests and instructions. Large external source trees are copied into `external/sources/` for local transfer, but are not committed by default.

## Required Environment Variables

- `SA_REF_DATA`: canonical `ref___data` directory.
- `SA_CLIENT_ASSET_ROOT`: client asset root containing `map/` and `data/adrn_136.bin`, `real_136.bin`, `data/pal/Palet_1.sap`.
- `SA_GMSV_SOURCE`: original `gmsv` server source.
- `SA_CLIENT_SOURCE`: original 8.5 client source.
- `SA_SAAC_DATA`: original 2016 SAAC data directory.
- `SA_SAAC_SOURCE`: original SAAC source.

See `external/resources.json` for the current local paths and purpose of each source.

## Copying Sources For Transfer

Use the transfer script when you want a portable local bundle that includes `external/sources/`:

```bash
node scripts/package-transfer.mjs
```

The script writes into `external/transfer/`, which is ignored by git.
