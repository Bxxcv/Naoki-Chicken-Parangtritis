# SIMPLE INVENTORY

## Scope
This is **saleable product inventory**, not raw-material accounting.

Each product/outlet can have:
- stock_qty
- low_stock_threshold
- stock_mode: finite | unlimited
- availability: enabled | disabled

## Automatic changes
A completed/accepted order may decrement stock according to the chosen business rule. The exact point of decrement must be locked before implementation.

Recommendation for MVP: reserve/decrement when the order is accepted by the outlet, then restore on cancellation according to role-safe rules.

## Manual changes
Admin/owner can:
- set absolute stock
- add stock
- subtract stock
- mark unavailable

Every manual change writes `stock_movements`.
