# PAYMENT PLAN — DEFERRED GATEWAY

## Current MVP
Implement a payment abstraction, not a gateway-specific implementation.

Supported concepts:
- CASH
- MANUAL_QRIS
- GATEWAY (reserved/future)

## Manual QRIS
Outlet settings can:
- enable/disable manual QRIS
- upload/change QR image
- set display name/instructions
- choose whether proof upload is required

## Future gateway
When selecting a provider later:
1. create local order
2. calculate authoritative total server-side
3. create provider transaction server-side
4. save provider reference
5. receive authenticated webhook
6. verify provider status/amount
7. update local payment idempotently
8. allow order progression based on local trusted state

Never trust frontend payment success.
Never expose gateway secret keys in Vite client code.
