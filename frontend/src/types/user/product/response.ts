export type ProductResponse = {
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
  id?: Id
  name?: string
}

export type Id = {
  categoryId: number
  productId: number
}

export type ProductImage = {
  id: number
  imageUrl: string
  sortOrder: number
}
