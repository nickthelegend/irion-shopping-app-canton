# Irion Shopping (demo storefront)

A [Next.js](https://nextjs.org/) demo e-commerce storefront that shows how to
accept Irion payments with the drop-in [`@xorr-finance/irion-sdk`](../irion-sdk-canton).
It is a reference for integrators, not a production shop.

## Checkout flow

1. The shopper picks an item from the **hardcoded demo catalog** in
   [`lib/products.ts`](lib/products.ts) (a handful of sample products) and goes
   to checkout.
2. `app/actions/payment.ts` (a server action) POSTs to the merchant
   `/api/bills/create` endpoint (in
   [`irion-merchant-app-canton`](../irion-merchant-app-canton)) to create a bill
   and get back a hosted-checkout URL. If no merchant API credentials are set,
   it falls back to a DB-free direct settlement URL on the Irion core.
3. `app/checkout/page.tsx` calls `openIrionCheckout(checkoutUrl, ...)` from
   `@xorr-finance/irion-sdk`, which opens the Irion **`/pay` hosted checkout** (served by the
   consumer core) where the shopper pays on the **Canton** ledger.

So the path is: **storefront → `@xorr-finance/irion-sdk` → merchant `/api/bills/create` →
Irion `/pay` (Canton)**.

## How to run

This app runs on **port 3001**. It expects the merchant API and the Irion core
(which hosts `/pay`) to be reachable.

```bash
npm install
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001).

### Environment (optional)

Without credentials, checkout uses the direct-settlement fallback, so the demo
works out of the box. To route through the merchant bills API instead, set:

```bash
# Merchant bills endpoint (default: https://merchants.irion.finance/api/bills/create)
MERCHANT_API_URL=http://localhost:3004/api/bills/create
IRION_CLIENT_ID=...
IRION_CLIENT_SECRET=...

# Irion consumer core that hosts /pay (default: http://localhost:3000)
IRION_CORE_URL=http://localhost:3000
```

## Tech stack

- Next.js 16 (App Router)
- React 19, Tailwind CSS v4, Framer Motion
- [`@xorr-finance/irion-sdk`](../irion-sdk-canton) — `openIrionCheckout` drop-in checkout
