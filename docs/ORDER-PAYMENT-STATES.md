# ORDER & PAYMENT STATE MACHINES

## Order state
```text
pending
  ├─> confirmed
  └─> cancelled
confirmed
  ├─> preparing
  └─> cancelled (only by allowed role/rule)
preparing
  ├─> ready
  └─> cancelled (restricted)
ready
  └─> completed
```

## Payment state
```text
unpaid
  ├─> pending
  └─> paid (cash/POS path may be immediate)
pending
  ├─> paid
  ├─> failed
  └─> expired
paid
  └─> refunded (future feature)
```

## Rules
- Payment state is NOT order state.
- Client cannot force a state transition.
- Every transition that matters creates history.
- Payment gateway integration later must be webhook/idempotency driven.
- Do not retry provider transaction creation blindly.
