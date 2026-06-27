// Pure cart operations — the logic behind CartProvider, factored out so it can
// be unit-tested without React/jsdom. The provider in cart-context.tsx wraps
// these in state; the behaviour lives here.

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

/** Add a product: bump quantity if it's already in the cart, else append qty 1. */
export function addItem(items: CartItem[], product: Omit<CartItem, "quantity">): CartItem[] {
  const exists = items.find((i) => i.id === product.id)
  if (exists) {
    return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
  }
  return [...items, { ...product, quantity: 1 }]
}

/** Remove a line item entirely by id. */
export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((i) => i.id !== id)
}

/** Sum of price × quantity across all line items. */
export function cartTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}
