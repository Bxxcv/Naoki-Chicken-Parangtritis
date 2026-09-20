# TESTING & ACCEPTANCE

## Status vocabulary
- PASS = actually tested and works
- FAIL = tested and broken
- NOT VERIFIED = not tested
- BLOCKED = cannot safely verify

## MVP test levels
### Level 1 — Static
- build succeeds
- no obvious runtime import errors
- responsive layout smoke check

### Level 2 — Auth/RLS
- correct role sees correct area
- unauthorized role is rejected server-side
- outlet scoping works

### Level 3 — Order
- create order
- recalculate totals server-side
- status transitions
- cancellation rules
- history created

### Level 4 — POS/Cash
- open session
- cash payment
- cash adjustment
- close session
- reconciliation math

### Level 5 — Stock
- product availability
- stock decrement rule
- cancel/restore rule
- manual adjustment
- history

### Level 6 — Future payment gateway
- provider create
- success
- fail
- expire
- duplicate webhook
- provider/local mismatch
- idempotent reconciliation

Never call the system production-ready if critical tests are merely assumed.
