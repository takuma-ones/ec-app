'use client'

import {
  addCartItem,
  getMyCartItemsQuantity,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/api/user/carts'

import { CartResponse, addCartItemRequest, updateCartItemRequest } from '@/types/user/cart'
import { getCookie } from 'cookies-next'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'

type CartContextType = {
  totalQuantity: number
  refreshCart: () => Promise<void>
  addItemToCart: (data: addCartItemRequest) => Promise<CartResponse>
  updateCartItem: (productId: number, data: updateCartItemRequest) => Promise<CartResponse>
  removeItemFromCart: (productId: number) => Promise<CartResponse>
  resetCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [totalQuantity, setTotalQuantity] = useState<number>(0)

  const refreshCart = useCallback(async () => {
    const quantity: number = await getMyCartItemsQuantity()
    setTotalQuantity(quantity)
  }, [])

  const addItemToCart = async (data: addCartItemRequest): Promise<CartResponse> => {
    const response = await addCartItem(data)
    await refreshCart()
    return response
  }

  const updateCartItem = async (
    productId: number,
    data: updateCartItemRequest
  ): Promise<CartResponse> => {
    const response = await updateCartItemQuantity(productId, data)
    await refreshCart()
    return response
  }

  const removeItemFromCart = async (productId: number): Promise<CartResponse> => {
    const response = await removeCartItem(productId)
    await refreshCart()
    return response
  }

  const resetCart = () => {
    setTotalQuantity(0)
  }

  useEffect(() => {
    const token = getCookie('user-token')

    if (!token) {
      setTotalQuantity(0)
      return
    }
    refreshCart().catch((error) => {
      console.warn('カート数の取得に失敗しました:', error)
      setTotalQuantity(0)
    })
  }, [refreshCart])

  return (
    <CartContext.Provider
      value={{
        totalQuantity,
        refreshCart,
        addItemToCart,
        updateCartItem,
        removeItemFromCart,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
