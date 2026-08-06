# FreshPlate — Flow Detail & Change Requests

Companion to the [user-flow diagram](https://claude.ai/code/artifact/ae7fd3d9-55d4-41dc-9918-5ac26af7bdf2).
Section 1 details what each flow actually does, step by step. Section 2 inventories every
place the app currently substitutes dummy data or a dummy workflow for a real one, with a
proposed change request per item.

---

## 1. Flow detail

### 1.1 First-time setup (onboarding wizard) — `src/app/onboarding/page.tsx`

One `<AnimatePresence>` wizard, 5 steps, index `0..4`. State is written to the Zustand store
(and therefore `localStorage`) on every change, keyed off a stable `householdIdRef` created
once per session — so a refresh mid-wizard resumes on the exact same step with the exact same
draft, not a blank form.

| Step | Screen | Captures | Notes |
|---|---|---|---|
| 1 | "Where are you from?" | State of residence, optional state of origin, household diet (veg/egg/non-veg) | Origin drives regional-recipe weighting later; residence drives availability checks. `Continue` is disabled until a residence state is picked. |
| 2 | "Who's eating?" | One or more household members — name, age, gender, activity level, optional weight/height, allergies/dislikes (free-text, comma-split) | Members can be removed inline. Weight/height are optional and estimated if skipped. |
| 3 | "Health goals" | Per-member goal: weight loss/gain, muscle building, recovery, diabetic-friendly, heart-healthy, maintenance | Renders an empty-state prompt if step 2 was skipped with zero members. |
| 4 | "Delivery address" | Free-text address/area | UI copy explicitly tells the user this step **does not** connect a real platform: *"You'll link Zepto and Swiggy accounts in the app... For now we'll use demo data."* |
| 5 | "You're all set!" | Read-only summary of the above | `Generate My Plan` calls `completeOnboarding()`, which runs a live availability check (if a platform is later connected) and generates the first `WeeklyPlan`, then routes to `/calendar`. On failure it toasts an error and **stays on this step** rather than navigating, so the user can retry. |

**Routing guard:** `src/app/page.tsx` redirects `/` to `/calendar` once
`household.onboardingComplete === true`, otherwise to `/onboarding`. Every other route
(`/calendar`, `/shopping`, `/pantry`, `/profile`) independently re-checks the same flag on
mount and bounces back to `/onboarding` if it's not set — a deep link mid-onboarding can never
land on a blank/broken tab.

### 1.2 The weekly loop

Once a plan exists, the four tabs in `AppShell` function as stations in one cycle rather than
independent pages.

**Plan (`/calendar`)** — 7×4 grid (day × breakfast/lunch/snack/dinner). Per meal: `Swap` (opens a
filtered candidate list), `Lock`/`Unlock` (excludes the slot from `Regenerate`), `Cooked` (calls
`markMealCooked`, decrementing pantry stock for that recipe's ingredients immediately), and, for
dinner only, `Order In` (marks the slot as a Swiggy order-in instead of a cooked meal — no
integration, purely a plan-display state). Header actions: `Regenerate` (rebuilds the whole
week, respecting locks) and `Build List` (routes to Shop).

**Shop (`/shopping`)** — Builds a shopping list from the current plan minus what's already in
the pantry (`buildShoppingList`), grouped by category, with a platform toggle
(Zepto/Instamart). `refreshAvailability(platform)` fills in live price/pack size/availability
per item when connected. `Order Now` either places a real order immediately (unconnected /
demo path) or, when connected, opens a binding-order confirmation sheet first — the copy is
explicit that a live order is *"real, binding... payment and delivery happen for real, not a
demo."*

**Pantry (`/pantry`)** — Stock list grouped by category, with LOW and EXPIRING badges computed
client-side (quantity thresholds / date-diff ≤ 3 days). Restocks two ways: automatically, when
`AppShell`'s 60-second delivery poll (`checkDeliveries`) sees an order transition to
`delivered`; and manually, via the add-item modal or the "quick add from your usual orders" chip
row (sourced from `getFrequentItems()` on each *connected* platform only).

**Profile (`/profile`)** — Household diet override, per-member nutrition targets and diet
override, add/remove members, connect/disconnect Zepto & Instamart (`/api/auth/[platform]/start`
→ OAuth → `/api/auth/[platform]/callback` → back to `/profile?connected=…`), pick a saved
delivery address per connected platform, `Regenerate weekly plan`, and `Restart onboarding`.
Diet/members/goals here feed straight back into the next plan generation; connecting a platform
is what turns Shop's pricing from demo to live.

**The two return paths into Pantry** are asymmetric on purpose: cooking a meal deducts stock
*synchronously*, in the same click; a delivered order restocks *asynchronously*, on the next
60-second poll, with no user action required. Pantry stock in turn biases the *next* plan
generation toward recipes that use up what's already on hand (`pantryScore` in `store.ts`).

### 1.3 Connecting a platform

The only flow that leaves the app entirely: `Profile → Zepto/Instamart's own OAuth consent
screen (PKCE) → redirect back to /profile?connected=zepto|instamart → live pricing & real
orders unlock`. Disconnecting is local-only (clears the session cookie), no redirect involved.

---

## 2. Dummy data / dummy workflow inventory

Ordered roughly by how much of the real product experience each one currently blocks.

### 2.1 `MockCommerceAdapter` stands in for both platforms end-to-end
**Where:** `src/lib/mcp/adapter.ts:106-212`
**What's dummy:** A complete fake `CommerceAdapter` — 8 hardcoded products (`MOCK_PRODUCTS`), one
hardcoded address (`"Home (demo)"`), artificial `setTimeout` latency, `DEMO-<timestamp>` order
IDs, and a `trackOrder()` that fabricates "delivered" purely by checking whether 90 seconds have
elapsed since the fake order was created.
**Why it's there:** Every screen needs *something* to render before a household connects a real
account — this is the fallback `resolveAdapter()` returns whenever `isConnected()` is false.
**Change request:** Acceptable as a demo mode, but nothing in the UI marks *which specific
numbers* are fake beyond a small "Demo pricing" label — e.g. the ₹28 tomato price and the 25-min
ETA look identical in styling to a real quote. Recommend a persistent visual treatment (not just
a caption) on every price/ETA/product row sourced from `MockCommerceAdapter`, and stripping the
90-second auto-delivery simulation before any user testing that involves timing expectations.
**✅ Done:** Added a persistent `demo` chip next to every per-item price in Shop
(`shopping/page.tsx`) and next to the total on Pantry's active-order banner
(`pantry/page.tsx`, keyed off `order.id.startsWith("DEMO-")`) — both survive independent of the
one-time top banner. Extracted the 90s window into a named `DEMO_DELIVERY_DELAY_MS` constant in
`adapter.ts` so it's a one-line change (or deletion) before timing-sensitive user testing, instead
of a magic number inside `trackOrder()`.

### 2.2 `placeOrder()` duplicates the mock checkout logic in the store
**Where:** `src/lib/store.ts:492-504`
**What's dummy:** A second, separate hardcoded order-creation path (`DEMO-<timestamp>` id,
₹50-per-item fallback price) that only runs when `resolveAdapter` reports `live: false` — this is
different code from `MockCommerceAdapter.checkout()`, not a call into it.
**Change request:** Consolidate onto `MockCommerceAdapter.checkout()` so there is one demo-order
implementation instead of two that can drift (e.g. the ₹50 fallback here vs. `MockCommerceAdapter`'s
own per-item mock prices).
**✅ Done:** `placeOrder()`'s demo branch now calls `adapter.updateCart()` + `adapter.checkout()`
on the same `MockCommerceAdapter` instance `resolveAdapter()` already returns, instead of
hand-rolling its own id/timestamp/total. Each line gets a synthetic `platformRef` keyed by
`ingredientId` so items without a real `platformRef` yet (pre-`refreshAvailability`) don't
collide in the mock adapter's cart `Map`. One ₹50 fallback price now lives only in
`MockCommerceAdapter.updateCart`.

### 2.3 Availability-aware plan generation is inert without a connected platform
**Where:** `src/lib/store.ts:16-62` (`buildAvailabilityCache`, `availabilityScore`)
**What's dummy:** `buildAvailabilityCache` returns an *empty* cache whenever the platform isn't
live (by design — mock data "always reports available," so it "carries no real signal"), and
`availabilityScore` then returns a flat neutral `0.5` for every recipe. The PRD's headline
feature — plan generation that accounts for live ingredient availability — does nothing
until a real account is connected.
**Change request:** This is a reasonable behavior, but it's invisible to the user: onboarding
step 4 promises availability-aware plans ("FreshPlate checks ingredient availability at your
location") before any platform is connected. Recommend either softening that copy for the
pre-connection state, or surfacing a "connect a platform to enable availability-aware planning"
prompt somewhere a first-time user will actually see it (Plan header or Profile).
**✅ Done:** Both. Softened the onboarding step-4 subtitle to make the availability check
conditional on connecting a platform, rather than reading as already active. Added a dismissible
amber banner to the Plan header (`calendar/page.tsx`), driven by `useCommerceStatus()` (the same
source of truth Shop/Pantry/Profile already use — not the stale `household.connectedPlatforms`
field), that links to Profile whenever neither platform is connected.

### 2.4 Onboarding and Shopping copy self-report "demo mode," but nothing upstream tracks it as a fact
**Where:** `src/app/onboarding/page.tsx:386`, `:401`; `src/app/shopping/page.tsx:180`
**What's dummy:** The literal strings *"For now we'll use demo data"* and *"Demo mode"* are
onboarding copy, not a derived state — there's no household-level "isDemo" flag; "live" is
recomputed per-platform, per-render from `resolveAdapter`.
**Change request:** Low priority, cosmetic risk only: if a future feature needs to know "has this
household ever gone live on anything," there's currently no single source of truth for it —
worth a `household.everConnectedPlatform` style flag if that need arises, rather than deriving it
ad hoc from `connectedPlatforms`.
**⏭️ Skipped, no action taken:** The proposal is explicitly conditional on "if that need arises" —
no current caller needs this flag, so adding it now would be an unused abstraction ahead of a
real requirement. Revisit if/when a feature actually needs to answer "has this household ever
gone live."

### 2.5 A 1.2-second artificial delay on demo checkout
**Where:** `src/app/shopping/page.tsx:87`
**What's dummy:** `await new Promise((r) => setTimeout(r, 1200))`, explicitly commented "keep the
demo's simulated feel," runs only on the non-live order path before calling `placeOrder`.
**Change request:** Harmless, but it's a second place (alongside 2.1's `setTimeout` calls inside
`MockCommerceAdapter`) simulating latency independently. If demo timing ever needs tuning, both
have to be found and changed together.
**✅ Done:** Removed. Now that 2.2 routes the demo checkout through
`MockCommerceAdapter.checkout()`, its own internal 600ms delay already provides the simulated
latency — `shopping/page.tsx` no longer needs (or has) one of its own.

### 2.6 Frequent-items quick-add is correctly gated, but the mock behind it is a fixed set of 3
**Where:** `src/app/pantry/page.tsx:69-76`; `src/lib/mcp/adapter.ts:200-211`
**What's dummy:** `MockCommerceAdapter.getFrequentItems()` returns the same first 3 entries of
`MOCK_PRODUCTS` for every household, every time — no personalization is possible without a real
order history. The pantry page already recognizes this and hides the quick-add row entirely
unless at least one platform is connected — this is the one item in this list that's *already*
handled correctly, listed here for completeness.
**Change request:** None needed. Flagged as a "verify it stays this way" item — any future
refactor of `connectedPlatforms` filtering should keep this gate.

### 2.7 Instamart checkout only wires Cash on Delivery
**Where:** `src/lib/mcp/instamartCommerce.ts:133-166`
**What's dummy/incomplete:** `checkout()` hardcodes `paymentMethod: "Cash"`. The comment states
UPI needs `get_payment_options` + a `check_payment_status`/`confirm_order` polling loop that is
"deferred for now (see PRD open Qs)" — this is a real, not-yet-built workflow, not mock data, but
it means every *live* Instamart order today is COD regardless of what the household would
actually choose.
**Change request:** Track as a real feature gap. Before enabling live Instamart ordering broadly,
either build the UPI polling loop or make the COD-only constraint visible in the Shop UI (it's
currently silent — the confirmation sheet never mentions payment method).
**◐ Partially done:** Added a "Payment: Cash on Delivery" row plus an explanatory note to the
binding-order confirmation sheet in `shopping/page.tsx`, so this is no longer silent. Building
the UPI polling loop itself is out of scope for this pass (a real feature, not a dummy-data fix)
— left open, tracked here and in the PRD's open questions.

### 2.8 Zepto checkout only wires Cash on Delivery, and its response parsing was never verified live
**Where:** `src/lib/mcp/zeptoCommerce.ts:16-20`, `:170-193`
**What's dummy/incomplete:** Same COD-only gap as Instamart. Additionally, the file's own header
comment states cart/order/tracking *output* shapes were "not empirically observed (only their
input schemas)," so `normalizeCart`, `checkout`, and `trackOrder`'s parsing is "defensive/best-effort"
and explicitly needs verifying "against a real connected account before shipping checkout."
**Change request:** Treat this as a pre-launch blocker, not a style note: run one real, live
Zepto checkout end-to-end and confirm `normalizeCart()`'s assumptions (e.g. that `price` is in
paise, that `cartItems` vs `items` covers the real response) against actual output before this
path handles a real household's money.
**◐ Partially done / ⚠️ needs manual verification:** Added the same "Payment: Cash on Delivery"
disclosure to the confirm sheet (shared with 2.7, since it applies to both platforms). The core
ask — running one real, live Zepto checkout to confirm `normalizeCart()`'s parsing assumptions —
requires a live connected Zepto account and cannot be exercised by an automated pass in this
repo. **Still open: treat as a pre-launch blocker and verify manually against a real account
before this path handles real money**, same as 2.10.

### 2.9 No pack-size-aware ordering yet
**Where:** `src/lib/store.ts:451-453`
**What's dummy/incomplete:** Live order quantities are `Math.ceil()`'d to whole units — "need
600g" becomes "order 1 unit," not "order 2× 500g pack." Called out in-code as a known PRD FR-4.2
simplification, not an oversight.
**Change request:** Track as a real feature gap (already documented in the PRD) rather than a
bug — but worth surfacing in the Shop UI ("we've rounded up") so the estimated total isn't read
as more precise than it is.
**✅ Done:** Added a note to the binding-order confirmation sheet in `shopping/page.tsx` ("Quantities
are also rounded up to whole packs where a partial pack isn't sold"), alongside the payment-method
disclosure from 2.7/2.8. The rounding logic itself (`Math.ceil`) is unchanged — still tracked as
PRD FR-4.2.

### 2.10 `SESSION_SECRET` silently falls back to a hardcoded dev value
**Where:** `src/lib/mcp/session.ts:48-57`
**What's dummy:** Outside `NODE_ENV === "production"`, a missing `SESSION_SECRET` env var
silently resolves to the literal string `"dev-only-insecure-secret-change-me-before-deploying-32chars"`
rather than failing.
**Change request:** Not a UX gap, but adjacent to this audit: confirm every non-local deployment
target (staging, preview deploys) actually sets `NODE_ENV=production` or its own `SESSION_SECRET`
— a preview environment that skips the production check would silently encrypt real OAuth
tokens with a secret that's committed to source control in cleartext.
**⚠️ Needs manual verification, not addressed by this pass:** This is a deployment/environment
check, not a code change — go through each real deployment target (staging, preview, prod) and
confirm `NODE_ENV=production` or an explicit `SESSION_SECRET` is actually set there. Left as-is in
code, since the guard for production is already correct; the risk is purely in environment
configuration outside this repo.

---

### Not dummy, checked and clean
The recipe library (`src/lib/recipes.ts`), nutrition targets (`src/lib/nutrition.ts`), and unit
conversion (`src/lib/units.ts`) were checked against the same mock/demo/placeholder patterns —
no hits. These are real, curated content and formulas, not stand-ins.
