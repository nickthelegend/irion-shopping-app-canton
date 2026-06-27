import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { CartProvider } from "@/lib/cart-context"
import Home from "./page.tsx"
import { PRODUCTS } from "@/lib/products"

// Render the storefront home (a client component using useCart) inside the cart
// provider, to static markup — proves the page mounts and lists the catalogue.

test("Home renders the product catalogue", () => {
  const html = renderToStaticMarkup(
    <CartProvider>
      <Home />
    </CartProvider>,
  )
  // every product name from the catalogue appears
  for (const p of PRODUCTS) assert.ok(html.includes(p.name), `missing product ${p.name}`)
})

test("Home renders each product's price", () => {
  const html = renderToStaticMarkup(
    <CartProvider>
      <Home />
    </CartProvider>,
  )
  // the first product's price (e.g. 45) shows somewhere in the markup
  assert.ok(html.includes(String(PRODUCTS[0].price)) || html.includes(PRODUCTS[0].price.toFixed(2)))
})
