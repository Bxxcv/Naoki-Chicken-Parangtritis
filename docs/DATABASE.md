# DATABASE DESIGN — MVP

## Design goals
- Supabase/PostgreSQL first.
- Server-authoritative money/order calculations.
- Simple stock model.
- Outlet scoping is present in the schema, but the product UI is Parangtritis-only for MVP.
- UUID primary keys.
- timestamps in UTC; render in Asia/Jakarta.
- append-only histories for important state changes.

## Core entities
profiles
roles
outlets
categories
products
product_channel_rules
orders
order_items
order_status_history
customers
payments
payment_methods
inventory_items
stock_movements
cash_sessions
cash_transactions
expenses
promotions
users_outlet_memberships
settings
notifications
audit_logs

## Recommended relationships
profiles 1—n users_outlet_memberships
outlets 1—n users_outlet_memberships
outlets 1—n products
categories 1—n products
products 1—n order_items
orders 1—n order_items
orders 1—n payments
orders 1—n order_status_history
products 1—n stock_movements
cash_sessions 1—n cash_transactions

## Money
Use integer minor units where practical (IDR has no fractional minor unit in typical business display). Store `amount_idr BIGINT` or integer-equivalent. Never use binary floating point for persisted money.

## Order snapshots
`order_items` should store the product name and unit price snapshot used at purchase time, so later product edits do not rewrite history.

## Order statuses
`pending`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`

Payment status must be separate:
`unpaid`, `pending`, `paid`, `failed`, `expired`, `refunded`

## Stock
`inventory_items` contains current state for saleable products per outlet.
`stock_movements` stores every change with reason, actor, and reference.
