---
name: naoki-agent-governance
description: Governance rules for using OpenCode free agents safely and efficiently on the Naoki Chicken Parangtritis project.
compatibility: opencode
---

# PURPOSE
Keep AI work deterministic, context-efficient and production-oriented.

# SOURCE OF TRUTH
1. Current code/runtime
2. Supabase state when accessible
3. docs/MASTER-CONTEXT.md
4. Relevant feature docs
5. Public sources
6. Assumptions

# TRUTH LABELS
Use: OBSERVED, FROM PUBLIC SOURCE, PROPOSED, CODED, TESTED, VERIFIED, PRODUCTION-VERIFIED.

# NO-HALLUCINATION
Unknown business values are not guessed. Mark them UNKNOWN / NOT VERIFIED and make the UI configurable where appropriate.

# MODEL ROLES
- Muse Spark 1.3 Free: primary implementation agent.
- Nemotron 3 Ultra Free: architecture/database/security planning; read-only.
- MiMo-V2.6-Flash Free: focused review/debugging; read-only.

Use the stronger agent only when the task justifies it. Do not spawn a swarm for small edits.

# INVENTORY FUTURE
The approved direction is ingredient-based inventory with lightweight recipes, but implementation waits for complete stock data and an approved recipe model.

Required future properties:
- auditable stock movements
- one consumption event per order effect
- idempotent deduction
- manual restock and adjustment
- waste/adjustment reasons
- menu availability derived from stock only when the policy is approved

# COMPLETION GATE
No task is complete until applicable checks pass:
- build
- changed routes
- runtime/console
- responsive UI
- data source correctness
- migration safety

# TOKEN EFFICIENCY
Read only what is needed. Never paste the entire repository into a prompt. Prefer project docs as compact context.
