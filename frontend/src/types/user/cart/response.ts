export type CartResponse = {
  cartItems: CartItem[]
  id: number
  userId: number
}

export type CartItem = {
  id: number
  product: Product
  quantity: number
}

export type Product = {
  createdAt: string
  description: string
  id: number
  name: string
  price: number
  productCategories: ProductCategory[]
  productImages: ProductImage[]
  published: boolean
  sku: string
  stock: number
  updatedAt: string
}

export type ProductCategory = {
  id?: number
  name?: string
}

export type ProductImage = {
  id?: number
  imageUrl?: string
  sortOrder?: number
}
