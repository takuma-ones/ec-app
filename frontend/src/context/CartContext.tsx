// src/context/CartContext.tsx
'use client'

import { createContext, useContext } from 'react'

type CartContextType = {
  totalQuantity: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const totalQuantity = 0 // 初期値は0、実際のアプリではAPIから取得する
  return <CartContext.Provider value={{ totalQuantity }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
