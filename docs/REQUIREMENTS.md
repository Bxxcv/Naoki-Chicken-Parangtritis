# PRODUCT REQUIREMENTS

## Customer
- Browse categories and products.
- Product detail, quantity, optional notes.
- Cart with server-authoritative price recalculation.
- Select order type: dine-in / takeaway / pickup / delivery.
- Select outlet (MVP fixed to Parangtritis; model is ready for future outlet support).
- Choose payment method exposed by outlet settings.
- View order number and tracking status.
- Guest ordering must be possible unless a business requirement later says otherwise.

## Order controls
The outlet can enable/disable each channel independently:
- dine_in_enabled
- takeaway_enabled
- pickup_enabled
- delivery_enabled

## Payment controls
MVP payment abstraction supports:
- cash
- manual QRIS upload/configuration
- future payment gateway provider

Payment gateway integration is deliberately deferred.

## POS / Cashier
- quick product search/category navigation
- cart editing
- order type
- discounts only when permitted
- payment selection
- receipt/order reference
- open/close cash session
- cash in/out adjustments with reason
- end-of-shift reconciliation

## Kitchen
- queue of newly accepted orders
- preparing
- ready
- completed/handed off
- cancellation rules controlled server-side
- no direct price/payment mutation from kitchen view

## Products
- name
- description
- image
- category
- base price
- availability
- simple stock tracking
- channel visibility
- featured/bestseller flag

## Simple stock
Track saleable item availability, not ingredient consumption.
Required actions:
- set stock
- add/subtract adjustment
- mark unlimited
- mark unavailable
- threshold alert
- stock movement history

## Customers
- guest order identity
- optional account profile
- order history
- consent-aware contact storage

## Expenses
- amount
- category
- note
- date/time
- payment source
- created_by
- optional attachment later

## Reports
- sales
- order counts
- average order value
- channel mix
- payment mix
- expenses
- net sales view
- cash reconciliation
- product performance

## Analytics
Every chart must have a defined data source. No decorative analytics.
