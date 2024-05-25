import { Product } from '../entities'

export type ProductParams = {
  [field: string]: {
    exactMatch: boolean
    value: unknown
  }
}

export interface IProductRepository {
  saveProduct(product: Product): Promise<number>
  findProductByParam(param: string, value: unknown): Promise<Product>
  findAllProducts(params?: ProductParams): Promise<Product[]>
  removeProduct(id: number): Promise<void>
}
