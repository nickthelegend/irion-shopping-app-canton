# Irion Shopping

> A demo storefront accepting **Irion** private-credit checkout — _Buy Now, Pay Never._

A reference e-commerce store, wired end-to-end to the [Irion](https://github.com/nickthelegend) checkout SDK. It exists to show how a real merchant drops Irion into a storefront: browse a catalogue, build a cart, hit checkout, and let the shopper pay with **Direct**, **BNPL**, or **private Credit** — settling on the [Canton Network](https://www.canton.network/). It is a reference for integrators, not a production shop.

Irion is private consumer credit + B2B neobank infrastructure built on Canton (Daml smart contracts). Privacy is by construction: a contract is visible only to its signatory and observer parties, so credit lines, balances, and settlements stay private to the parties involved.

---

## What it is

`irion-shopping-app-canton` is a small [Next.js 16](https://nextjs.org/) storefront that runs on **port `:3001`**. It owns nothing about money — it delegates the entire payment to the published [`@xorr-finance/irion-sdk`](https://www.npmjs.com/package/@xorr-finance/irion-sdk) and the Irion backend services. The store's only job is the parts a real store actually owns: a product catalogue, a cart, and a checkout button.

Everything credit-, settlement-, and privacy-related happens behind the SDK, on Canton.

---

## Checkout flow

```
  Storefront (:3001)
      │  browse → cart → checkout
      ▼
  Server action  app/actions/payment.ts
      │  create a bill (POST /api/bills/create)
      ▼
  Merchant bills API   irion-merchant-app-canton (:3004)
      │  returns a hosted-checkout URL
      ▼
  @xorr-finance/irion-sdk   openIrionCheckout(url)
      │  opens the hosted /pay page
      ▼
  Irion /pay   irion-core-canton (:3000)
      │  shopper pays: Direct · BNPL · private Credit
      ▼
  Canton settlement   via irion-b2b-api (:8088) → Canton ledger
```

Step by step:

1. **Browse & cart.** The shopper picks from a small hardcoded demo catalogue in [`lib/products.ts`](lib/products.ts). Cart state is managed client-side; the pure add/remove/total logic lives in [`lib/cart.ts`](lib/cart.ts).
2. **Checkout → create a bill.** The checkout page calls the server action [`app/actions/payment.ts`](app/actions/payment.ts), which POSTs the order to the merchant **bills API** (`/api/bills/create` in [`irion-merchant-app-canton`](https://github.com/nickthelegend/irion-merchant-app-canton)) and receives a hosted-checkout URL. If no merchant API credentials are configured, it falls back to a database-free direct-settlement URL on the Irion core, so the demo always works out of the box.
3. **Open the SDK checkout.** The page calls `openIrionCheckout(checkoutUrl, …)` from `@xorr-finance/irion-sdk`. The SDK opens the Irion **`/pay` hosted checkout** (served by [`irion-core-canton`](https://github.com/nickthelegend/irion-core-canton)) and listens for the (origin-checked) payment result.
4. **Pay & settle.** On `/pay`, the shopper chooses **Direct** (pay in full), **BNPL**, or **private Credit**. Settlement happens on the **Canton** ledger via the [`irion-b2b-api`](https://github.com/nickthelegend/irion-b2b-api). The SDK posts the result back, and the storefront shows a settlement-confirmed (or failed) panel.

---

## How it uses the SDK

The store depends on the published npm package [`@xorr-finance/irion-sdk`](https://www.npmjs.com/package/@xorr-finance/irion-sdk) — the same Stripe-style drop-in any merchant would install. This repo uses one entry point from it:

```ts
import { openIrionCheckout } from "@xorr-finance/irion-sdk";

openIrionCheckout(checkoutUrl, {
  allowedOrigin: coreOrigin, // only trust results posted from the Irion core
  onSuccess: (result) => { /* settlement confirmed */ },
  onError:   (result) => { /* settlement failed */ },
});
```

The SDK manages the checkout popup and an origin-filtered `postMessage` listener, so the store never touches ledger calls, wallet signing, or credit logic directly. The bill is created in a server action ([`app/actions/payment.ts`](app/actions/payment.ts)) so client code never sees merchant API credentials.

---

## Getting started

```bash
npm install
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001).

The storefront runs standalone for browsing, but a full checkout expects the rest of the Irion stack to be reachable:

| Service | Repo | Port |
|---|---|---|
| Merchant bills API | `irion-merchant-app-canton` | `:3004` |
| Irion core (hosts `/pay`) | `irion-core-canton` | `:3000` |
| B2B API (Canton ledger gateway) | `irion-b2b-api` | `:8088` |

### Environment (optional)

Without credentials, checkout uses the direct-settlement fallback, so the demo works out of the box. To route through the merchant bills API instead, set:

```bash
# Merchant bills endpoint (default: https://merchants.irion.finance/api/bills/create)
MERCHANT_API_URL=http://localhost:3004/api/bills/create
IRION_CLIENT_ID=...
IRION_CLIENT_SECRET=...

# Irion core that hosts /pay (default: http://localhost:3000)
IRION_CORE_URL=http://localhost:3000
# Public origin the SDK trusts for payment-result messages
NEXT_PUBLIC_IRION_CORE_URL=http://localhost:3000
```

---

## Testing

```bash
npm test
```

Tests run on `node:test` via [`tsx`](https://github.com/privatenumber/tsx) — no jsdom, no Playwright. They cover:

- **Pure cart logic** ([`lib/cart.test.ts`](lib/cart.test.ts)) — `addItem` / `removeItem` / `cartTotal`, including purity and quantity-merge behaviour.
- **Storefront render** ([`app/page.test.tsx`](app/page.test.tsx)) — renders the home page inside the cart provider with `react-dom/server` and asserts the catalogue (names and prices) shows up.

---

## Project layout

```
app/
  page.tsx              storefront — the product catalogue grid
  product/[id]/         single product detail page
  cart/page.tsx         cart view
  checkout/page.tsx     checkout — calls the SDK's openIrionCheckout
  actions/payment.ts    server action — creates the bill via the merchant API
  page.test.tsx         storefront render test
lib/
  products.ts           hardcoded demo catalogue
  cart.ts               pure cart operations (add / remove / total)
  cart-context.tsx      React provider wrapping the pure cart logic
  cart.test.ts          unit tests for cart.ts
```

---

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) · React 19
- Tailwind CSS v4 · Framer Motion · Lucide icons
- [`@xorr-finance/irion-sdk`](https://www.npmjs.com/package/@xorr-finance/irion-sdk) — `openIrionCheckout` drop-in checkout
- Settlement on the [Canton Network](https://www.canton.network/) (Daml)

---

## Related repos

| Repo | What |
|---|---|
| [`irion-sdk-canton`](https://github.com/nickthelegend/irion-sdk-canton) | `@xorr-finance/irion-sdk` — the drop-in checkout SDK this store consumes |
| [`irion-merchant-app-canton`](https://github.com/nickthelegend/irion-merchant-app-canton) | Merchant console + the bills API (`/api/bills/create`) |
| [`irion-core-canton`](https://github.com/nickthelegend/irion-core-canton) | Consumer app + the `/pay` hosted checkout |
| [`irion-b2b-api`](https://github.com/nickthelegend/irion-b2b-api) | REST API over the Canton ledger |
