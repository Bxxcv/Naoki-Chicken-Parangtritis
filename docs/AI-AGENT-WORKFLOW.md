# AI AGENT WORKFLOW — NAOKI PARANGTRITIS

## Purpose
OpenCode performs the coding. The human owner and project guide approve scope and business rules.

## Default flow
1. User states one task.
2. `naoki-builder` audits relevant code.
3. For risky architecture/database work, call `naoki-architect` first.
4. Builder implements the smallest coherent change.
5. `naoki-reviewer` checks the result when the change is non-trivial.
6. Builder applies only confirmed fixes.
7. Build/tests are run.

## Model allocation
- Builder: Muse Spark 1.3 Contributor Free.
- Architect: Nemotron 3 Ultra Free.
- Reviewer: MiMo-V2.6-Flash Free.

Do not automatically run all three on every task.

## Reasoning variants
Do not hard-code `xhigh` blindly. Variant availability is model-specific and should be confirmed in OpenCode with `/models`. Use the highest useful variant for risky architecture/database tasks and a lower variant for trivial edits when available.

## Tomorrow's inventory workflow
Do NOT code ingredient deduction before the second stock sheet arrives.

After the complete stock data is available:
1. `naoki-architect` produces the inventory blueprint.
2. Human confirms recipe/quantity rules.
3. Builder implements schema/services/UI.
4. Reviewer checks idempotency, transaction boundaries and RLS.
5. Only then integrate order → kitchen → inventory consumption.

## Recommended commands
```text
/naoki-plan <task>
```
Read-only architecture plan.

```text
/naoki-review
```
Read-only post-change review.

For normal work, keep the primary `naoki-builder` selected.
