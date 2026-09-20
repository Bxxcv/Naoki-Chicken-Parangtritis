# USER FLOWS

## Customer order
Home → Menu → Product → Cart → Order Type → Checkout → Payment → Confirmation → Tracking → Complete

## Dine-in
Menu → Cart → Dine-in → table/seat reference → payment rule → order created → kitchen → served → completed

## Takeaway
Menu → Cart → Takeaway → payment → kitchen → ready → pickup → completed

## Pickup
Menu → Cart → Pickup → pickup time/notes when enabled → payment → kitchen → ready → completed

## Delivery
Menu → Cart → Delivery → address/contact → payment → kitchen → ready → dispatched/handed off → completed

## Cashier
Start Shift → Open Cash Session → Create Order → Payment → Print/Show Receipt → Complete → Cash Adjustments → Close Shift → Reconcile

## Kitchen
New → Accepted/Preparing → Ready → Handed Off/Completed

## Owner
Login → Dashboard → inspect Orders/POS/Stock/Expenses/Reports → change outlet settings → manage users/products → audit activity

## Forbidden cross-flow mutations
- Kitchen cannot change price.
- Customer cannot mark payment as successful.
- Customer cannot mark order as completed.
- Staff cannot see data outside their granted scope.
- Client totals are never trusted for financial truth.
