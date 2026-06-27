"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItem, removeItem, cartTotal, type CartItem } from './cart';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('shopping_cart');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('shopping_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any) => setItems(prev => addItem(prev, product));

    const removeFromCart = (id: string) => setItems(prev => removeItem(prev, id));

    const clearCart = () => setItems([]);

    const total = cartTotal(items);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
