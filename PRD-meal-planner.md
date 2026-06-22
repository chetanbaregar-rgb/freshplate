# Product Requirements Document (PRD)
## **FreshPlate** — Weekly Family Meal Planner with Quick-Commerce Ordering

| Field | Value |
|---|---|
| Document owner | Chetan Baregar |
| Status | Draft v2.0 — updated with MCP integration discovery |
| Last updated | 2026-06-22 |
| Target market | India (multi-state, Tier-1 & Tier-2 cities first) |
| Platform (MVP) | Mobile-first (React Native / Flutter) + lightweight web companion |
| Build phase | Pre-development — this PRD precedes engineering kickoff |

> **Naming note:** "FreshPlate" is a placeholder. Finalize before launch.

> **v2.0 change summary:** Sections 5, 6, 7.3, 8.4, 8.5, 8.6, 9, 10, 12, 14, 15, and 16 have been updated to reflect the discovery that both **Zepto** (`github.com/zeptonow/mcp`) and **Swiggy Instamart** (`mcp.swiggy.com`) publish official MCP servers — eliminating the "no open API" risk that dominated v1.0.

---

## 1. Overview & Vision

**One-liner:** FreshPlate plans a family's week of meals (breakfast, lunch, dinner) around what's *actually available right now* on Zepto and Swiggy Instamart, tailored to each family member's diet, age, gender, and health goal — then orders exactly the missing ingredients in-app and tracks what's already in the kitchen.

**The core loop:**
1. Tell us about your household (state, diet type, family members, health goals).
2. We query live availability on Zepto/Instamart for fresh produce near you, then generate a personalized 7-day menu around what's actually in stock.
3. We compute the shopping list, subtract what you already have in stock, and let you order the rest without leaving FreshPlate.
4. Delivery status syncs automatically; pantry updates on arrival. As you cook, stock depletes — closing the loop for next week.

**Why now:** Zepto and Swiggy Instamart now publish official MCP servers, enabling any AI-native app to search products, manage carts, place orders, and track deliveries programmatically. FreshPlate becomes the **intelligence layer** sitting on top of these rails — turning quick-commerce into a personalized family nutrition service.

---

## 2. Problem Statement

Indian households face three recurring frictions:

1. **Decision fatigue:** "What do I cook today?" — repeated 21 times a week, across multiple family members with different needs.
2. **Diet/health mismatch:** Generic recipe apps ignore who's eating (a 7-year-old, a 65-year-old recovering from surgery, and an adult trying to build muscle all need different plans).
3. **Planning-to-purchase gap:** Even when a menu is chosen, translating it into a shopping list, checking the pantry, and ordering is manual and error-prone — leading to over-buying, food waste, or last-minute missing ingredients.

FreshPlate collapses *plan → shop → cook → restock* into one guided flow, powered by live platform data.

---

## 3. Goals & Success Metrics

### Product goals
- Reduce "what to cook" decision time to near-zero with a ready weekly plan.
- Generate accurate, household-tailored menus aligned to dietary rules and health goals.
- Convert plans into completed grocery orders with minimal friction — without leaving the app.
- Reduce food waste via stock tracking, smart list de-duplication, and near-expiry alerts.

### Success metrics (North Star + supporting)

| Metric | Type | Target (6 months post-launch) |
|---|---|---|
| **Weekly Active Households planning a full week** | North Star | 40% of MAU |
| Plan-to-order conversion rate | Activation | ≥ 45% of generated plans lead to a completed order |
| Recipes cooked (marked "made it") per household/week | Engagement | ≥ 8 |
| Menu personalization satisfaction (in-app rating) | Quality | ≥ 4.2 / 5 |
| Stock-tracking adoption | Retention driver | ≥ 55% of active households |
| Week-4 household retention | Retention | ≥ 32% |
| Avg. items ordered per plan | Monetization signal | ≥ 12 |
| Order-to-delivery auto-sync rate | Integration health | ≥ 90% of orders tracked without manual input |

---

## 4. Target Users & Personas

| Persona | Description | Primary need |
|---|---|---|
| **Primary cook / household manager** | The person who plans and cooks for the family (often a parent). Time-pressed, juggling multiple preferences. | A done-for-me weekly plan + one-tap ordering. |
| **Health-goal individual** | An adult with a specific goal (weight loss, strength, recovery). May plan only for themselves. | Goal-aligned, macro-aware meals. |
| **Caregiver** | Cooking for an elderly parent or recovering patient with dietary restrictions. | Safe, recovery-appropriate, easy meals. |
| **Dual-income couple / nuclear family** | Two working adults, possibly a child. Want convenience + nutrition. | Fast planning, fast ordering, minimal pantry management overhead. |

---

## 5. Scope

### In scope (MVP)
- Household & member onboarding (state, diet type, members, ages, genders, health goals).
- Nutrition/menu engine producing a 7-day plan (breakfast, lunch, dinner; snacks optional).
- Recipe library with regional/state-aware and diet-aware filtering.
- **Live availability queries** via Zepto MCP and Swiggy Instamart MCP — no heuristics, real data from day one.
- Auto-generated shopping list with pantry/stock subtraction.
- **In-app cart management and order placement** via MCP (no deep-link hand-off needed).
- Real-time order tracking via MCP; auto-update pantry on delivery.
- Stock / pantry inventory tracking with cook→deduct automation.
- Weekly calendar view with swap/edit.
- "Order in tonight" slot — delegate a dinner to Swiggy Food ordering (bonus feature from Swiggy's 14-tool Food MCP).

### Out of scope (backlog)
- FreshPlate-operated delivery infrastructure.
- Social feed, recipe sharing community.
- Calorie photo-logging / wearable integration.
- Blinkit integration (no official MCP found; add if they publish one).
- Multi-language UI beyond English (Hindi fast-follow in V1).

---

## 6. Assumptions & Constraints

- Users have a Zepto and/or Swiggy account with a serviceable address and a linked payment method.
- Zepto MCP is available at `https://mcp.zepto.co.in/mcp` (HTTP transport, OAuth/OTP auth).
- Swiggy Instamart MCP is available at `https://mcp.swiggy.com/im`; Swiggy Food at `https://mcp.swiggy.com/food` (OAuth 2.1 with PKCE). **Production access requires submitting a working demo to builders@swiggy.in — begin this process in Phase 0.**
- Fresh-produce availability varies by city, dark-store, and time of day; cache responses with a short TTL (≤ 15 min).
- Health-goal guidance is **general wellness**, not medical/clinical nutrition. Requires disclaimers.
- Indian regulatory context: **DPDP Act, 2023** governs personal + health data (§13).
- Real orders placed via Zepto/Swiggy MCP are **live and binding** — the UI must make this clear before checkout.

---

## 7. Key User Flows

### 7.1 First-run onboarding
1. Sign up (phone OTP / Google).
2. Select **state of residence** (drives regional cuisine + availability defaults).
3. Set **household diet type**: Veg / Non-Veg / Egg-etarian (Veg + egg). Allow per-member override.
4. **Add family members:** name/initial, age, gender. (At least 1 = the user.)
5. Set **health goal per member**: Weight loss, Weight gain, Strength/muscle building, Recovery, Maintenance, Diabetic-friendly, Heart-healthy, General wellness. Optional allergies/intolerances.
6. Confirm delivery location → FreshPlate queries Zepto + Instamart to check serviceability and fetch `your_go_to_items` (Swiggy) to pre-seed pantry.
7. → Generate first weekly plan.

### 7.2 Weekly planning
1. Open **Weekly Calendar** (Mon–Sun × Breakfast/Lunch/Dinner grid).
2. App queries live produce availability, then pre-fills a plan favoring recipes whose fresh ingredients are in stock near you.
3. User can **swap** any meal (alternatives respect diet + goal + live availability), **lock** favorites, mark **leftovers/repeat**, or designate any dinner slot as **"Order in"** (routes to Swiggy Food).
4. View per-day and per-member nutrition summary.
5. Confirm the week → triggers shopping list build.

### 7.3 Shopping list & in-app ordering
1. App aggregates ingredients across all planned meals (quantity-scaled to household size).
2. **Subtract current pantry stock.**
3. Show "Need to buy" list, grouped by category, with live availability + price from Zepto/Instamart.
4. User reviews list, edits if needed, selects platform (Zepto or Instamart), confirms.
5. FreshPlate calls `update_cart` (Instamart) or Zepto cart tools to populate the cart, then calls `checkout` / Zepto order placement. User approves payment in a native payment sheet — **one step, no app switching.**
6. Order status shown in-app via `track_order`; pantry auto-updates on delivery confirmed.

### 7.4 Cook & restock loop
1. User marks a meal **"Cooked"** → consumed ingredients deducted from pantry stock.
2. Low-stock staples surface as **reorder suggestions**; near-expiry items surface recipe suggestions that use them.
3. Next week's plan generation accounts for remaining stock, reducing unnecessary purchases.

### 7.5 "Order in" flow (bonus — Swiggy Food)
1. User taps a dinner slot → selects "Order in tonight."
2. FreshPlate calls `search_restaurants` filtered by diet type and goal preferences.
3. User browses menu via `get_restaurant_menu`, adds items via `update_food_cart`, checks out via `place_food_order`.
4. Order tracked via `track_food_order`.

---

## 8. Functional Requirements

### 8.1 Household & Profile Management
- **FR-1.1** Create/edit household with state of residence (all Indian states/UTs).
- **FR-1.2** Add/edit/remove family members; each has name, age, gender, optional health goal, optional allergies/dislikes.
- **FR-1.3** Set household-level diet type with per-member override (Veg / Non-Veg / Egg).
- **FR-1.4** Per-member health goal from a defined enum; one primary goal per member in MVP.
- **FR-1.5** Edit any attribute later; changes re-trigger plan recalculation prompt.
- **FR-1.6** Connect Zepto account (OAuth/OTP) and/or Swiggy account (OAuth 2.1 PKCE) during or after onboarding; support both platforms simultaneously.

### 8.2 Nutrition & Menu Engine
- **FR-2.1** Compute per-member daily nutritional targets (calories + macros) using age, gender, and goal via Mifflin-St Jeor BMR × activity factor, goal-adjusted. Activity level: sedentary/moderate/active.
- **FR-2.2** Aggregate household targets and constraints (strictest dietary rule wins for shared dishes).
- **FR-2.3** Generate a 7-day plan (3 meals/day + optional snacks) balancing variety, regional preference (by state), goal alignment, and **live ingredient availability** queried from connected platforms.
- **FR-2.4** Each recipe tagged with diet type, cuisine/region, goal-suitability, macros, prep time, difficulty, and ingredient list.
- **FR-2.5** Respect allergies/dislikes as hard filters.
- **FR-2.6** Swap suggestions maintain nutritional balance and confirm availability before offering.
- **FR-2.7** Handle mixed households — shared base dish + member-specific portion/variant guidance.

### 8.3 Recipe Library
- **FR-3.1** Curated recipe dataset with structured ingredients (name, quantity, unit, category, substitutability).
- **FR-3.2** State/region tagging for regional cuisine relevance.
- **FR-3.3** Each ingredient mapped to canonical SKU search terms used with `search_products` on Zepto/Instamart.
- **FR-3.4** Recipe detail: steps, time, servings (scalable), nutrition per serving, member suitability.

### 8.4 Quick-Commerce Availability & Catalog (via MCP)
- **FR-4.1** On weekly plan generation, call `search_products` (Instamart) and Zepto's product search for key fresh ingredients at the user's delivery address. Prefer recipes where core fresh ingredients return results.
- **FR-4.2** Map canonical recipe ingredients → platform-specific search queries; handle pack-size awareness (e.g., need 600g tomatoes → suggest 2× 500g pack).
- **FR-4.3** Flag unavailable ingredients with substitution options; re-query on swap.
- **FR-4.4** Cache availability results per address with a 15-minute TTL; show "last refreshed" timestamp in UI.
- **FR-4.5** On first connect, call `your_go_to_items` (Instamart) and Zepto order history to suggest pantry pre-seeding from past purchases.

### 8.5 Shopping List & In-App Ordering (via MCP)
- **FR-5.1** Aggregate + de-duplicate ingredients across the week; scale quantities to household size and servings.
- **FR-5.2** Subtract current pantry stock; output net "to buy" list.
- **FR-5.3** Show per-item: availability status (in stock / out of stock / limited), pack size, price, platform badge (Zepto / Instamart).
- **FR-5.4** Price comparison: if both platforms are connected and an item is available on both, show the cheaper option.
- **FR-5.5** User confirms list → FreshPlate calls `update_cart` / `clear_cart` + `update_cart` on the chosen platform, populates the full cart programmatically.
- **FR-5.6** Checkout: call `checkout` (Instamart) or Zepto order placement; surface payment options (UPI, card, COD, wallet) in a native UI. User confirms; order is placed.
- **FR-5.7** On order placed, create an Order record with platform, items, and expected delivery window.

### 8.6 Stock / Pantry Management (MCP-enhanced)
- **FR-6.1** Maintain a pantry inventory (item, quantity, unit, optional expiry).
- **FR-6.2** On delivery confirmation — detected via `track_order` status reaching "delivered" — auto-add ordered items to pantry stock. No manual confirm needed.
- **FR-6.3** Deduct ingredients when a meal is marked "Cooked."
- **FR-6.4** Low-stock and near-expiry alerts; surface recipes that consume soon-to-expire items.
- **FR-6.5** Manual add/edit/remove of pantry items.
- **FR-6.6** On first use, offer to pre-seed pantry from `your_go_to_items` and Zepto order history — user reviews and confirms.

### 8.7 Weekly Calendar
- **FR-7.1** Grid view: 7 days × meal slots; tap a slot for detail/swap.
- **FR-7.2** Drag/move meals between slots; lock meals.
- **FR-7.3** Per-day and weekly nutrition rollup.
- **FR-7.4** "Regenerate week" and "Regenerate single meal" actions (re-checks live availability).
- **FR-7.5** Reminders/notifications for plan-ahead and cooking (opt-in).
- **FR-7.6** "Order in" toggle on any dinner slot → routes to Swiggy Food flow (§7.5).

### 8.8 Order in — Swiggy Food (bonus)
- **FR-8.1** Call `search_restaurants` filtered to user's address and diet preference.
- **FR-8.2** Display restaurant list with cuisine, rating, delivery time.
- **FR-8.3** Call `get_restaurant_menu` or `search_menu` for selected restaurant; show items with goal-suitability hints.
- **FR-8.4** Cart via `update_food_cart`, coupon via `fetch_food_coupons` / `apply_food_coupon`, checkout via `place_food_order`.
- **FR-8.5** Track via `track_food_order`; surface ETA in app.

---

## 9. MCP Integration Architecture

> **v2.0 note:** The "no open API" risk from v1.0 is eliminated. Both Zepto and Swiggy publish official MCP servers. This section replaces the old integration strategy entirely.

### 9.1 Zepto MCP

| Property | Detail |
|---|---|
| Endpoint | `https://mcp.zepto.co.in/mcp` (HTTP transport) |
| Auth | OAuth with Indian mobile OTP |
| Setup (dev) | `claude mcp add --transport http --scope user zepto https://mcp.zepto.co.in/mcp` |
| Key tools | Product search (live catalog + price + availability), cart add/update/remove, order placement, order history |
| Orders | Live and binding — not a sandbox |

### 9.2 Swiggy Instamart MCP

| Property | Detail |
|---|---|
| Endpoint | `POST https://mcp.swiggy.com/im` |
| Auth | OAuth 2.1 with PKCE |
| Setup (dev) | Local, no approval needed for development |
| Production access | Submit working demo video to builders@swiggy.in; approval required |
| Tools (13) | `search_products`, `your_go_to_items`, `get_addresses`, `create_address`, `delete_address`, `get_cart`, `update_cart`, `clear_cart`, `checkout`, `get_orders`, `get_order_details`, `track_order`, `report_error` |
| Orders | Live and binding |

### 9.3 Swiggy Food MCP (bonus)

| Property | Detail |
|---|---|
| Endpoint | `POST https://mcp.swiggy.com/food` |
| Tools (14) | `search_restaurants`, `search_menu`, `get_restaurant_menu`, `get_addresses`, `update_food_cart`, `get_food_cart`, `flush_food_cart`, `fetch_food_coupons`, `apply_food_coupon`, `place_food_order`, `get_food_orders`, `get_food_order_details`, `track_food_order`, `report_error` |
| Use case in FreshPlate | "Order in tonight" dinner slot; fallback when no suitable recipe found |

### 9.4 Platform capability matrix

| Capability | Zepto MCP | Instamart MCP | Food MCP |
|---|---|---|---|
| Live product search | ✅ | ✅ `search_products` | — |
| Frequently bought items | ✅ | ✅ `your_go_to_items` | — |
| Cart management | ✅ | ✅ `update_cart`, `get_cart`, `clear_cart` | ✅ `update_food_cart` |
| Order placement | ✅ | ✅ `checkout` | ✅ `place_food_order` |
| Order history | ✅ | ✅ `get_orders` | ✅ `get_food_orders` |
| Delivery tracking | — | ✅ `track_order` | ✅ `track_food_order` |
| Coupons/offers | — | — | ✅ `fetch_food_coupons`, `apply_food_coupon` |
| Restaurant search | — | — | ✅ `search_restaurants` |
| Auth method | OTP/OAuth | OAuth 2.1 PKCE | OAuth 2.1 PKCE |
| Production approval | Available | Demo video required | Demo video required |

### 9.5 MCP abstraction layer (backend)

FreshPlate's backend wraps all platform MCP calls behind a `CommerceAdapter` interface:

```
CommerceAdapter
  searchProducts(query, address) → ProductResult[]
  getCart(platform) → Cart
  updateCart(platform, items[]) → Cart
  clearCart(platform) → void
  checkout(platform, paymentMethod) → Order
  trackOrder(platform, orderId) → TrackingStatus
  getOrderHistory(platform) → Order[]
  getFrequentItems(platform, address) → Item[]
```

This means:
- Adding Blinkit (if they publish an MCP) requires only a new adapter — zero app changes.
- Platform outages degrade gracefully (fall back to the other platform).
- The UI is platform-agnostic; the adapter handles routing.

---

## 10. Data Model (Core Entities)

```
Household
  - id, name, state, diet_type (default), location/address, created_at
  - connected_platforms[]: { platform: 'zepto'|'instamart', auth_token, address_id }

Member
  - id, household_id, name, age, gender, diet_override,
    health_goal, activity_level, allergies[], dislikes[]

NutritionTarget (derived)
  - member_id, calories, protein_g, carbs_g, fat_g, computed_at

Recipe
  - id, name, cuisine_region, diet_type, goal_tags[], meal_type,
    prep_time, difficulty, servings_base, nutrition_per_serving, steps[]

Ingredient (canonical)
  - id, name, category, default_unit, substitutes[]
  - search_terms: { zepto: string, instamart: string }  ← maps to MCP search queries

RecipeIngredient
  - recipe_id, ingredient_id, quantity, unit, optional

AvailabilityCache
  - ingredient_id, platform, address_id, in_stock, pack_size, price,
    sku_id, fetched_at  (TTL: 15 min)

WeeklyPlan
  - id, household_id, week_start, status

PlanMeal
  - plan_id, day, meal_type, recipe_id | 'order_in', member_scope, locked

ShoppingList
  - plan_id, items[] (ingredient_id, qty_needed, qty_in_stock, qty_to_buy,
                       platform, sku_id, pack_size, price)

PantryItem (Stock)
  - household_id, ingredient_id, quantity, unit, expiry_date, updated_at

Order
  - id, household_id, plan_id, platform ('zepto'|'instamart'|'swiggy_food'),
    platform_order_id, items[], status (placed|on_the_way|delivered),
    placed_at, delivered_at
```

---

## 11. Non-Functional Requirements
- **Performance:** Weekly plan generation (including availability queries) < 5s; shopping list build < 2s. Availability queries run in parallel across platforms.
- **Offline:** View saved plan, recipes, and pantry offline; sync on reconnect.
- **Scalability:** Availability lookups cached per address+TTL; stateless plan service horizontally scalable.
- **Reliability:** If one platform MCP is unavailable, surface items on the other; flag missing items clearly.
- **Accessibility:** WCAG AA; large-text and high-contrast support.
- **Localization-ready:** EN at launch, Hindi fast-follow.
- **Security:** All MCP OAuth tokens stored in device secure enclave / keychain; never on FreshPlate servers. Backend is a thin orchestrator, not a token store.

---

## 12. Tech Architecture (Proposed)

```
┌─────────────────────────────────────────────────────┐
│                  FreshPlate App                     │
│         (React Native / Flutter — iOS + Android)    │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Calendar │  │ Recipe/Plan  │  │ Pantry/Stock │  │
│  │   UI     │  │     UI       │  │     UI       │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
└───────┼───────────────┼─────────────────┼──────────┘
        │               │                 │
        ▼               ▼                 ▼
┌───────────────────────────────────────────────────┐
│              FreshPlate Backend (API)             │
│         Node.js / NestJS or Python / FastAPI      │
│                                                   │
│  ┌────────────────┐   ┌──────────────────────┐   │
│  │  Plan/Nutrition │   │   CommerceAdapter    │   │
│  │     Engine      │   │  (MCP orchestrator)  │   │
│  │  (rules + LLM)  │   │                      │   │
│  └────────────────┘   └──────┬───────────────┘   │
│                               │                   │
│  ┌────────────────────────────┼─────────────────┐ │
│  │  Postgres (core data)      │ Redis (avail.   │ │
│  │  + Recipe + Pantry DB      │ cache, 15m TTL) │ │
│  └────────────────────────────┴─────────────────┘ │
└─────────────────────────┬─────────────────────────┘
                          │ MCP calls (HTTP)
         ┌────────────────┼──────────────────┐
         ▼                ▼                  ▼
  ┌────────────┐  ┌──────────────┐  ┌──────────────┐
  │ Zepto MCP  │  │  Swiggy MCP  │  │  Swiggy MCP  │
  │ (grocery)  │  │  Instamart   │  │   Food       │
  │ zepto.co.in│  │  swiggy.com  │  │  swiggy.com  │
  └────────────┘  └──────────────┘  └──────────────┘
```

**Key components:**
- **Client:** React Native or Flutter.
- **Backend:** Thin orchestration layer — calls MCP tools, runs nutrition math, manages plan/pantry data.
- **Plan/Nutrition engine:** Deterministic rules for calorie/macro targets; Claude (LLM) for recipe variety scoring, swap reasoning, and natural-language explanations — with guardrails on nutrition math.
- **CommerceAdapter:** Wraps all MCP calls; single interface for Zepto + Instamart + Food; plug in new platforms without app changes.
- **Auth:** OAuth tokens for Zepto (OTP) and Swiggy (PKCE) stored in device keychain; backend never persists them.
- **Notifications:** Push (FCM/APNs) for plan reminders, low stock, near-expiry, delivery arrival.

---

## 13. Privacy, Compliance & Safety
- **DPDP Act 2023 compliance:** Explicit consent for collecting age, gender, and health-goal data (sensitive); purpose limitation; right to erasure; data minimization.
- **Children's data:** Members can be minors → parental consent handling; avoid profiling minors beyond meal needs.
- **Health disclaimer:** "General wellness guidance only, not medical advice. Consult a doctor or dietitian for medical conditions." Shown at goal-setting, recovery, and diabetic flows.
- **Order binding disclaimer:** "Orders placed via Zepto or Swiggy are real, live orders. Confirm before checkout." Shown at cart review.
- **Third-party ToS:** Zepto and Swiggy MCP usage must comply with their respective developer terms. No scraping, no ToS circumvention.
- **Payment data:** Never touched by FreshPlate — handled entirely within the Zepto/Swiggy payment flow.
- **Token security:** OAuth tokens stored device-side in secure enclave/keychain; FreshPlate backend is a stateless orchestrator.

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Swiggy MCP production approval rejected or delayed | Medium — Instamart onboarding blocked | Build full Zepto integration first; use Instamart in dev mode throughout; apply to Swiggy early (builders@swiggy.in) |
| Zepto/Swiggy MCP endpoints change or go down | Medium — ordering breaks | CommerceAdapter abstraction isolates app from MCP changes; graceful error UI with manual retry |
| Availability cache staleness leading to out-of-stock orders | Medium — bad UX | 15-min TTL; re-check on cart population; surface "confirm availability" at checkout |
| Nutrition advice perceived as medical | High (liability) | Strong disclaimers; "general wellness" framing; no clinical claims |
| Recipe-to-SKU mapping inaccuracy (wrong item ordered) | Medium | Human-curated search-term mapping for top ingredients; user reviews cart before checkout |
| Plan quality / repetitive menus | Medium (churn) | Variety scoring; LLM-assisted swaps; "make it" / ratings feedback loop |
| Multi-member conflicting goals | Medium | Shared base dish + per-member portion/variant guidance |
| Regional cuisine coverage gaps | Medium | Prioritize top states by user base; expand recipe DB iteratively |
| Blinkit not covered | Low–Medium | Noted as out-of-scope; monitor for Blinkit MCP publication; CommerceAdapter ready to plug it in |

---

## 15. Phased Roadmap

### Phase 0 — Setup & foundations (pre-build, 2–4 weeks)
- **Apply to Swiggy Builders Club** immediately (builders@swiggy.in); begin building demo.
- Add Zepto MCP to development environment: `claude mcp add --transport http --scope user zepto https://mcp.zepto.co.in/mcp`.
- Scaffold CommerceAdapter with Zepto implementation; test all tool calls end-to-end.
- Source/curate recipe + ingredient dataset; build canonical ingredient → MCP search-term map for top ~200 ingredients.
- Finalize nutrition formula with an advisor.

### Phase 1 — MVP (6–8 weeks)
- Onboarding (state, diet, members, goals, platform auth).
- Nutrition engine + 7-day plan generation with live availability queries.
- Weekly calendar with swap (availability-aware).
- Shopping list with pantry subtraction + in-app cart population + checkout via Zepto MCP.
- Real-time order tracking + auto-pantry update on delivery.
- Swiggy Instamart MCP (pending approval) added in parallel; show in UI once approved.
- Basic pantry/stock with cook→deduct.

### Phase 2 — V1 (4–6 weeks post-MVP)
- Swiggy Food "Order in" dinner slot (14-tool Food MCP).
- Hindi localization.
- Near-expiry waste-reduction suggestions.
- Price comparison across Zepto vs Instamart.
- Pantry pre-seed from `your_go_to_items` + order history.
- Improved LLM-assisted plan variety and swap reasoning.

### Phase 3 — Growth
- Snacks, festival/seasonal menus, budget mode.
- Wearable/activity integration for sharper calorie targets.
- Blinkit integration (if MCP published).
- Affiliate/commission revenue from Zepto/Swiggy partner programs (if offered).

---

## 16. Open Questions (resolve before/early in build)

1. **Swiggy production approval timeline:** When do we apply? What demo is needed? This is now the primary external dependency.
2. **Geographic focus for launch:** Which states/cities first? (Drives recipe dataset priority and coverage assumptions.)
3. **Nutrition depth in MVP:** Macro-level only, or include micronutrients and diabetic carb-counting from day one?
4. **LLM usage:** Use Claude API for plan generation + swap reasoning, or rules-only for MVP? LLM adds quality; rules are cheaper and faster.
5. **Recipe data source:** Build in-house (high quality, high cost), license a dataset (faster), or use an LLM to generate + human-verify?
6. **Monetization model:** Affiliate/commission on Zepto/Swiggy orders (requires partner program enrollment), subscription for premium plans, or free + ads?
7. **Household vs individual plan:** MVP targets households; should single-user mode be a first-class flow from day one?

---

## Appendix A — Health Goal → Planning Logic

| Goal | Calorie posture | Macro emphasis | Recipe bias |
|---|---|---|---|
| Weight loss | Deficit (−15–20%) | Higher protein, higher fiber, lower refined carb | High-satiety, lower-oil, more veg |
| Weight gain | Surplus (+10–15%) | Balanced, calorie-dense | Nutrient-dense, healthy fats |
| Strength/muscle | Maintenance/slight surplus | High protein (1.6–2.2 g/kg) | Protein-forward (paneer, dal, eggs, chicken) |
| Recovery | Maintenance | High protein, anti-inflammatory, easy-digest | Soft, light, nourishing (khichdi, soups) |
| Diabetic-friendly | Maintenance | Low-GI, controlled carbs, high fiber | Whole grains, low-sugar, less rice |
| Heart-healthy | Maintenance | Low saturated fat, high fiber | Less fried, more whole foods, less salt |
| Maintenance / general | Maintenance | Balanced | Varied, regional |

> Exact formulas to be finalized with a nutrition advisor in Phase 0.

---

## Appendix B — MCP Setup Quick Reference

### Zepto (available now, no approval needed)
```bash
claude mcp add --transport http --scope user zepto https://mcp.zepto.co.in/mcp
```
Or via JSON config:
```json
{
  "mcpServers": {
    "zepto": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.zepto.co.in/mcp"]
    }
  }
}
```

### Swiggy Instamart + Food (dev: no approval; prod: apply to builders@swiggy.in)
```
Instamart endpoint: POST https://mcp.swiggy.com/im
Food endpoint:      POST https://mcp.swiggy.com/food
Dineout endpoint:   POST https://mcp.swiggy.com/dineout
Auth: OAuth 2.1 with PKCE
Docs: https://mcp.swiggy.com/builders/docs
Contact: builders@swiggy.in
```
