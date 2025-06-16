import UserHeader from '@/components/user/layout/header'
import { CartProvider } from '@/context/CartContext'

export default function Userlayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <UserHeader />
      {children}
    </CartProvider>
  )
}
