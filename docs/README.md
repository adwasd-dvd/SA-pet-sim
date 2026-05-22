# Project Documents

This is the documentation entrypoint for the StoneAge Web Rebuild.

## Start Here

- `docs/MIGRATION.md`: how to move this project to another computer.
- `docs/planning/PROJECT_MEMORY.md`: current project memory, decisions, and next work.
- `docs/planning/DEVELOPMENT_PLAN.md`: long-term rebuild plan.
- `docs/planning/CLOUD_RUNTIME_STRATEGY.md`: cloud/web/multiplayer/AI NPC architecture strategy.
- `docs/planning/AI_NPC_SOCIAL_PROPOSAL_PLAN.md`: planned AI NPC persona, social memory, and confirmation proposal system.
- `docs/planning/WORKER_NATIVE_GMSV_PORT.md`: plan for replacing `gmsv/saac` process dependencies with Worker-native services.
- `docs/planning/GMSV_SAAC_WORKER_PORT_MAP.md`: concrete mapping from original server protocol/functions to Worker-native services.
- `docs/planning/tasks.jsonl`: machine-readable task backlog and progress.

## Source And Data

- `docs/planning/SOURCE_REFERENCES.md`: canonical original source/data references.
- `external/resources.json`: portable manifest of bundled external sources and generated assets.
- `docs/planning/SAVE_SCHEMA.md`: browser save model based on SAAC.

## Operations

- `README.cloudflare.md`: Cloudflare Worker run/deploy notes.
- `scripts/check-resources.mjs`: verifies bundled external sources and generated runtime assets.
- `scripts/package-transfer.mjs`: creates a local transfer archive.
