export type OrderResponse = {
  createdAt: string
  id: number
  items: Item[]
  shippingAddress: string
  status: string
  totalAmount: number
  userId: number
}

export type Item = {
  id: number
  price: number
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
  id: number
  name: string
}

export type ProductImage = {
  id: number
  imageUrl: string
  sortOrder: number
}
