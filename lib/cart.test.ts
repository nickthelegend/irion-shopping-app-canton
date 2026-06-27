import { test } from "node:test"
import assert from "node:assert/strict"
import { addItem, removeItem, cartTotal, type CartItem } from "./cart.ts"

const P = (id: string, price: number) => ({ id, name: id, price, image: `/${id}.png` })

test("addItem: appends a new product with quantity 1", () => {
  const items = addItem([], P("p1", 45))
  assert.equal(items.length, 1)
  assert.equal(items[0].quantity, 1)
  assert.equal(items[0].price, 45)
})

test("addItem: increments quantity for an existing product (no duplicate line)", () => {
  let items = addItem([], P("p1", 45))
  items = addItem(items, P("p1", 45))
  assert.equal(items.length, 1)
  assert.equal(items[0].quantity, 2)
})

test("addItem: keeps distinct products as separate lines", () => {
  let items = addItem([], P("p1", 45))
  items = addItem(items, P("p2", 12))
  assert.equal(items.length, 2)
  assert.deepEqual(items.map((i) => i.id), ["p1", "p2"])
})

test("addItem: is pure (does not mutate the input array)", () => {
  const original: CartItem[] = []
  addItem(original, P("p1", 45))
  assert.equal(original.length, 0)
})

test("removeItem: drops the matching line, leaves others", () => {
  const items = [
    { ...P("p1", 45), quantity: 2 },
    { ...P("p2", 12), quantity: 1 },
  ]
  const out = removeItem(items, "p1")
  assert.deepEqual(out.map((i) => i.id), ["p2"])
})

test("cartTotal: sums price × quantity", () => {
  const items = [
    { ...P("p1", 45), quantity: 2 }, // 90
    { ...P("p3", 29.99), quantity: 1 }, // 29.99
  ]
  assert.equal(cartTotal(items), 119.99)
})

test("cartTotal: empty cart is 0", () => {
  assert.equal(cartTotal([]), 0)
})
