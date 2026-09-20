# UI/UX SYSTEM

## Visual references
- `reference-ui/admin-dashboard-reference.jpeg`
- `reference-ui/customer-ordering-reference.jpeg`

## Direction
### Customer
The second supplied reference is the visual anchor:
- strong food-first hero
- bold red/yellow/cream palette
- large appetizing product imagery
- rounded cards
- obvious CTA
- compact mobile ordering
- category navigation that is easy to thumb-reach

### Admin
The first supplied reference is the visual anchor:
- left navigation on desktop
- dense but readable dashboard cards
- sales chart + order status + top products + channel mix
- strong hierarchy
- operational data before decoration

## Anti-AI-slop rules
- no generic purple-gradient SaaS
- no excessive glassmorphism
- no random gradient backgrounds
- no giant meaningless headings in admin
- no fake charts or vanity metrics
- no excessive rounded-everything treatment
- no decorative UI that blocks task completion
- no motion for motion's sake

## Motion
Use purposeful animation only:
- page/section fade + slight translate on entry
- card hover lift on desktop
- drawer/modal transitions
- order status transition feedback
- skeleton loading
- cart add/remove micro-interactions
- success confirmation animation

Avoid:
- constant floating animations
- parallax-heavy effects
- auto-playing distractions
- animation that delays critical actions

## Responsive strategy
Design mobile first.
Breakpoints should be content-driven, not framework-default worship.
Required states:
- narrow phone
- wide phone
- tablet
- desktop
- large desktop

Admin mobile should use a bottom nav or compact navigation pattern; desktop may use a sidebar.

## Accessibility baseline
- buttons have readable labels
- visible focus states
- sufficient text contrast
- do not rely on color alone for status
- touch targets should be comfortably tappable
- form errors are announced/visible near the field

## Performance baseline
- image dimensions known before load
- lazy-load non-critical images
- avoid massive JS libraries for tiny UI effects
- keep route/page bundles sensible
- no blocking animations on first interaction
