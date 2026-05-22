# AI NPC Social Sandbox And Proposal Plan

Status: v1 implemented through `npc-social-001` to `npc-social-005` on 2026-05-22. Keep using this document as the guardrail for follow-up work, and do not extend the system with scattered ad hoc patches. The source of truth for scheduling remains `docs/planning/tasks.jsonl`.

## Implementation Checkpoint

The v1 slice is complete and regression-covered:

- Worker builds compact source-grounded NPC persona context and bounded `game.npcSocial` relationship memory.
- Critical AI/social actions create `flags.pendingNpcProposal` plus a UI-safe `game.dialog.proposal`; they do not mutate state before player confirmation.
- `POST /api/game/dialog-proposal` revalidates NPC identity, range, proposal id, expiry, resources, inventory, pet roster, selected pet, and source constraints before VM-backed commit.
- `effects.npcConditionOverrides` supports scoped, short-lived, one-shot condition relief for source script checks while leaving final rewards, warps, flags, and task completion inside the deterministic NPC VM.
- The browser dialogue window renders compact `同意` / `拒绝` proposal controls, including pet selection when needed.
- Prompt/cache guardrails keep token use bounded and prevent proposal or memory-changing replies from entering the pure-chat cache.

Future work should treat this as the stable contract. New NPC favors, discounts, hidden goods, warps, savepoint favors, pass/避敌 effects, or task-condition relief must add proposal regression coverage rather than bypassing this path.

## Goal

NPCs should feel like people in the Stone Age world instead of static prompt wrappers. They should understand their own name, map, role, source script meaning, likely profession, gender or age clues when confidence is high, and their current relationship with the player.

The AI layer may make conversations livelier, but the Worker remains the only authority for every gameplay mutation. Any action that costs or grants stone, items, pets, task condition relief, transport, limited rewards, bypass effects, or shop advantages must become a short-lived NPC proposal first. The player must confirm it in the dialogue UI before the Worker validates and executes it.

## Non-Goals For v1

- Do not generate permanent new quest lines.
- Do not let AI edit save data, flags, inventory, pets, map location, or quest state directly.
- Do not make gender determine rewards, discounts, probability, or task outcome.
- Do not store raw chat transcripts or large NPC memories in saves.
- Do not put character save data into `MapRoomDO`; multiplayer hot room state and persistent character state stay separate.

## Required Runtime Model

### NPC Persona

Add an `npcPersona` builder in the Worker that derives compact persona data from existing source-grounded fields:

- `name`
- `type`
- `template`
- `graphic`
- `dialogueLines`
- `scriptHints`
- `questLead`
- `actions`
- `map`
- source script summaries

The persona should include:

- identity label
- profession or duty guess
- source/script meaning
- available conversation topics
- likely age or social role clues when available
- gender inference with confidence and signals
- role-fit capabilities such as healer, savepoint, shopkeeper, route NPC, gatekeeper, quest helper, NPCEnemy, daily villager

Gender behavior:

- High-confidence gender may affect address, flirting replies, warmth, and refusal wording.
- Unknown or low-confidence gender must not be forced.
- Gender must not decide price, discount, reward, task success, or hostility.

### NPC Social State

Add `game.npcSocial` as compact save state:

```json
{
  "schema": "stoneage-npc-social-v1",
  "npcs": {
    "npc-id": {
      "affinity": 0,
      "trust": 0,
      "suspicion": 0,
      "helped": 0,
      "threatened": 0,
      "challenged": 0,
      "declined": 0,
      "failed": 0,
      "cooldownUntil": 0,
      "memories": []
    }
  }
}
```

Resource rules:

- Keep at most 32 NPC entries per character save in v1.
- Keep at most 5 memories per NPC.
- Keep each memory short and structured, for example `{ kind, text, at, weight }`.
- Prefer summaries such as "玩家帮我完成过采集请求" over raw dialogue.
- NPCs helped by the player should speak more warmly and negotiate more readily.
- NPCs threatened, tricked, challenged, or repeatedly failed should become more guarded.

### Social Decision Inputs

NPC negotiation should consider:

- relationship state: affinity, trust, suspicion, helped, threatened, challenged
- player state: level, charm, luck, stone, inventory, pets
- source role fit: healer, shopkeeper, route NPC, savepoint, quest NPC, NPCEnemy, villager
- current map and range
- recent dialogue intent: chat, flirt, bribe, plead, threat, favor, task condition relief
- cooldown and recent failed attempts

Rolls must be deterministic or Worker-owned, recorded in `dialog.debug`, and not chosen by the model.

## Proposal System

### Core Rule

AI and local rules may only create `flags.pendingNpcProposal`. They must not execute critical actions directly.

Critical actions include:

- taking stone
- taking items
- taking pets
- giving stone
- giving items
- giving pets
- warp or transport
- temporary no-encounter effect
- temporary pass or let-through effect
- shop discount
- hidden or off-menu goods
- lowering, replacing, or bypassing task conditions
- source savepoint or role favors that consume substitute payment

### Proposal Shape

`game.dialog.proposal` should expose only the UI-safe subset:

```json
{
  "schema": "stoneage-npc-proposal-v1",
  "id": "short-id",
  "npcId": "npc-id",
  "npcName": "NPC name",
  "kind": "warp|trade|conditionOverride|discount|offMenuItem|noEncounter|pass|roleFavor",
  "title": "提案标题",
  "summary": "NPC 对这件事的说法",
  "costs": {
    "stone": 0,
    "items": [],
    "pets": [],
    "requiresPetChoice": false
  },
  "grants": {
    "stone": 0,
    "items": [],
    "pets": [],
    "warp": null,
    "effects": [],
    "conditionOverrides": []
  },
  "risk": "风险说明",
  "expiresAt": 0
}
```

The internal proposal may carry extra Worker-only execution metadata. Do not send raw source scripts or large prompt context to the browser.

### Confirm Endpoint

Add:

```text
POST /api/game/dialog-proposal
```

Request:

```json
{
  "game": {},
  "npcId": "npc-id",
  "proposalId": "proposal-id",
  "decision": "accept",
  "selectedPetIndex": 0
}
```

`decision` must be `accept` or `decline`.

On accept, the Worker must re-check:

- current NPC exists and matches `npcId`
- player is still in interaction range
- `proposalId` matches `game.flags.pendingNpcProposal`
- proposal has not expired
- inventory, pet slots, pet selection, stone, task state, flags, and effects are still valid
- role and source constraints still allow the proposed action

No partial mutation is allowed. Validate costs and gains on a cloned state first. Commit to the real `game` only if the whole proposal can succeed.

On decline:

- clear the pending proposal
- write a small social memory
- optionally adjust affinity or suspicion lightly according to NPC personality and wording
- do not mutate inventory, pets, stone, flags, task state, or location

## Condition Relief

Task condition relief is allowed, but only as scoped Worker state.

Use:

```json
{
  "effects": {
    "npcConditionOverrides": {
      "override-id": {
        "npcId": "npc-id",
        "eventNo": 4,
        "conditionHash": "hash",
        "conditionKind": "item|level|pet|stone|event",
        "conditionToken": "ITEM=1234*1",
        "substituteCost": { "stone": 300 },
        "expiresAt": 0,
        "usesLeft": 1
      }
    }
  }
}
```

Rules:

- Scope by `npcId`, `eventNo`, and `conditionHash`.
- Default to once-only or short TTL.
- The override may let a source condition pass or transform it into a substitute cost.
- Final rewards, pet grants, stone grants, warp, flags, and source task completion still execute through existing Worker NPC VM actions.
- `dialog.debug.conditionOverrides` and VM trace must expose creation, match, consumption, expiry, and refusal reasons without exposing raw source scripts.
- AI never writes flags or completes quests by itself.

## UI Requirements

Normal NPC chat remains natural input.

When `game.dialog.proposal` exists, render a compact confirmation panel inside the NPC dialogue surface. The panel must show:

- NPC 要求
- 玩家获得
- 风险
- 有效期

Buttons:

- `同意`
- `拒绝`

If a proposal requires handing over a pet but no specific pet is fixed, the panel must include a pet selector before `同意` is enabled.

Use the normal game API flow. Do not use `window.confirm` for this system.

## Prompt And Token Budget

NPC AI prompt context should include only:

- current NPC persona
- at most 3 relevant social memories
- compact player state
- current source/script facts and role capabilities
- current pending proposal summary if any
- last 2 to 4 dialogue turns

Do not include:

- full save JSON
- raw source scripts
- complete chat history
- social state for unrelated NPCs

Caching:

- Pure chat replies may use the existing short cache strategy.
- Replies that create proposals, write memories, change social scores, or cause any state transition must not be cached as pure chat.

## Debug And Save Surfaces

Extend `dialog.debug` with:

- persona inference
- gender confidence and signals
- compact social score
- negotiation roll and inputs
- proposal summary
- proposal accept or decline result
- VM trace for accepted actions

Extend save JSON with:

- `npcSocial`
- `effects.npcConditionOverrides`
- `flags.pendingNpcProposal`

## Implementation Order

1. Persona and social memory normalization.
2. Proposal schema, pending proposal storage, and prompt/action boundary.
3. Confirmation endpoint with clone validation and VM-backed execution.
4. Condition override effects and source condition integration.
5. Dialogue UI confirmation panel.
6. Regression tests and protocol/save docs.

## Required Regression Coverage

- Normal dialogue blocks bribe, favor, teleport, discount, and condition-relief negotiation unless AI mode is enabled.
- AI mode creates a proposal for critical actions but does not mutate state before confirmation.
- Accepting a proposal revalidates range, NPC, proposal id, expiry, inventory, pets, stone, flags, and task state.
- Declining clears the proposal and writes only social memory/relationship changes.
- Stone, item, pet, warp, discount, no-encounter, pass, off-menu goods, savepoint favors, and task-condition relief execute only through Worker VM or scoped effects.
- Insufficient stone, full inventory, full pet roster, expired proposal, wrong NPC, wrong range, and wrong pet selection all refuse without partial mutation.
- Helped NPCs become warmer or more cooperative; threatened/challenged NPCs become more suspicious.
- High-confidence gender affects flirting/address tone; unknown gender is not forced.
- `npm run check:npc` and `npm run check:protocol` must pass before marking v1 done.
- After save shape stabilizes, run full `npm run check`.
