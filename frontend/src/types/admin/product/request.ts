export type ProductRequest = {
  categoryIds: number[]
  description: string
  images: Image[]
  isPublished: boolean
  name: string
  price: number
  sku: string
  stock: number
}

export type Image = {
  sortOrder: number
  url: string
}
