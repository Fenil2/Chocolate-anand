"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/components/products/products";

const STORAGE_KEY = "mora-cart-v1";

type Line = { id: string; qty: number };

type Action =
  | { type: "hydrate"; lines: Line[] }
  | { type: "add"; id: string; qty?: number }
  | { type: "set"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(lines: Line[], action: Action): Line[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const qty = action.qty ?? 1;
      const existing = lines.find((l) => l.id === action.id);
      if (existing) return lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...lines, { id: action.id, qty }];
    }
    case "set":
      if (action.qty <= 0) return lines.filter((l) => l.id !== action.id);
      return lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(99, action.qty) } : l));
    case "remove":
      return lines.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

export type CartLine = { product: Product; qty: number; total: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isLineArray(value: unknown): value is Line[] {
  return (
    Array.isArray(value) &&
    value.every(
      (l) => typeof l === "object" && l !== null && typeof (l as Line).id === "string" && typeof (l as Line).qty === "number",
    )
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  // Load after mount so server and first client render match.
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (isLineArray(parsed)) dispatch({ type: "hydrate", lines: parsed.filter((l) => getProduct(l.id) && l.qty > 0) });
    } catch {
      /* storage unavailable: cart simply starts empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [raw, hydrated]);

  const add = useCallback((id: string, qty?: number) => dispatch({ type: "add", id, qty }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "set", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = raw.flatMap((l) => {
      const product = getProduct(l.id);
      return product ? [{ product, qty: l.qty, total: product.price * l.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      isOpen,
      open,
      close,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, isOpen, open, close, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
