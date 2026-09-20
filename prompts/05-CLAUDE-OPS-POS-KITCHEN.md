# CLAUDE — OPS / POS / KITCHEN

Read:
MASTER-CONTEXT, REQUIREMENTS, USER-FLOWS, POS-CASHIER, KITCHEN, ORDER-PAYMENT-STATES, ROLES-PERMISSIONS, SECURITY.

Implement only the operational module requested in this task.

POS:
- order creation/editing
- payment selection
- cash session support

Kitchen:
- queue
- status progression
- elapsed time

Security:
- kitchen cannot mutate financial values
- cashier permissions are scoped
- status transitions are server validated

Do not add payment gateway integration.
Do not invent unavailable Olsera behavior.

Provide changed-file list, checks performed, and exact remaining gaps.
