# POS / CASHIER

## MVP responsibilities
- create order from counter
- choose order type
- add/remove items
- apply allowed discount
- select payment method
- accept cash/manual QRIS
- create receipt/order reference
- open cash session
- cash in/out
- close and reconcile

## Cash session fields
- opening_amount
- opened_at
- opened_by
- closing_amount_declared
- expected_amount
- variance
- closed_at
- closed_by

## Reconciliation formula
Expected cash must be derived from authoritative cash transactions, not typed by the user as truth.

`variance = declared_closing_cash - expected_cash`

## Audit
Cash adjustments require:
- actor
- amount
- reason
- timestamp
