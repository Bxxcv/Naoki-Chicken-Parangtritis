---
description: Review the current implementation after a task
agent: naoki-reviewer
---

Perform a read-only post-change review for the task just completed.

Do not edit anything.

Check the actual current files and report:
- regressions
- runtime/build concerns
- route/UI problems
- data-flow or database concerns
- security/ownership concerns when applicable
- whether the implementation matches the task

Return PASS / FAIL / NEEDS-CHANGE with evidence and exact recommended fixes.
