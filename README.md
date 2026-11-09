# FreshPlate

A weekly meal planner for Indian households. It builds a seven-day plan around each family member's diet, health goal and allergies, turns the plan into a grocery list after subtracting what is already in the pantry, and can send that list to Zepto or Swiggy Instamart.

**Live:** https://freshplate.acbexperiments.cloud

## What it does

- **Onboarding:** pick your state, household diet (veg, egg or non-veg), add each member with age, goal, activity level, allergies and foods to avoid, and set a delivery address.
- **Weekly plan:** breakfast, lunch, dinner and snack for each day, drawn from a regional Indian recipe library (north, south, east, west, central, north-east). Meals can be locked, swapped, or marked as order-in.
- **Allergies are enforced.** Common allergens can be picked as chips, and anything else can be typed in. Recipes are matched by whole word against their name, description, ingredients and steps, so "egg" does not drop eggplant dishes. The planner, the swap list and plans that already exist all respect the list. Matching reads recipe text rather than structured allergen data and errs towards excluding, so treat it as a convenience and not as medical advice.
- **Shopping list:** adds up the same ingredient across meals (converting between g/kg and ml/l), subtracts pantry stock once, and keeps incomparable units as separate lines.
- **Pantry:** marking a meal cooked reduces stock once. Delivered orders add stock back.
- **Recipes:** browse and filter the whole library.
- **Zepto and Instamart:** when an account is connected, the app can search live products and place orders through each platform's MCP server. Without a connection it runs in a clearly labelled demo mode with sample prices.

## Privacy

There is no database. Household, plan, pantry and order data live in your browser's local storage. Platform sign-in tokens are held in an encrypted, httpOnly cookie (iron-session) in your own browser. The server does not store them, and the app never sees your platform password or OTP.

## Status

The Zepto and Instamart connections are built but not switched on for the live site. Neither platform issues a fixed client ID and secret, which this version of the app expects (see `src/lib/mcp/oauth.ts`), so connecting needs their approval and a change to register clients automatically. Until then the live site runs in demo mode for ordering.

## Tech

Next.js 15 (App Router) and React 19, TypeScript, Tailwind CSS with Radix UI, Zustand with persistence, iron-session, the Model Context Protocol SDK, and Vitest.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Nothing else is needed to try the planner. To try platform connections, copy `.env.example` to `.env.local` and fill in the platform settings. `SESSION_SECRET` (at least 32 characters, for example from `openssl rand -base64 32`) is required in production and optional in development.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (allergy matching, shopping and pantry maths, store behaviour) |

Lint, type check, tests and the build all run in CI on every pull request.
