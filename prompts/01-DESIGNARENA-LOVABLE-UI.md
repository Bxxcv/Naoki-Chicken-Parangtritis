# UI GENERATION PROMPT — LOVABLE / DESIGNARENA

Create a production-quality restaurant ordering + operations UI for **Naoki Chicken Parangtritis**.

Reference images supplied with this project:
- `reference-ui/customer-ordering-reference.jpeg`
- `reference-ui/admin-dashboard-reference.jpeg`

## Visual target
Customer side follows the food-ordering reference: bold red/yellow/cream, appetizing product imagery, strong CTA, compact cards, fast mobile ordering.
Admin follows the dashboard reference: operational analytics first, dense but readable cards, charts, order status, top products, stock alerts.

## Pages
Customer:
Home, Menu, Category, Product Detail, Cart, Checkout, Payment, Tracking, History, Profile.

Admin:
Dashboard, Orders, POS/Cashier, Kitchen, Products, Stock, Customers, Expenses, Payments, Reports, Analytics, Employees, Settings.

## Order modes
Dine-in, Takeaway, Pickup, Delivery.
The admin must have clear toggles to enable/disable each channel.

## Payment modes
Cash, Manual QRIS, Gateway placeholder. Gateway UI must be provider-agnostic and visually complete but not falsely connected.

## UX requirements
- mobile-first
- fast thumb navigation
- accessible contrast/focus
- clear success/error/loading states
- meaningful motion only
- skeleton loading
- empty states
- toast feedback
- keyboard support on desktop
- no giant decorative UI that hurts task speed

## Anti-slop
Do not use generic purple SaaS styling, random gradients, excessive glassmorphism, meaningless charts, oversized headings in admin, or decorative AI-looking sections.

## Output
Generate the page structure and reusable component system. Keep data mocked. Do not add backend code. The UI must later be straightforward to implement in React + Vite + Bootstrap + custom CSS.
