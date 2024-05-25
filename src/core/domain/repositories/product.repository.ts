import { Product } from '../entities'

export interface IProductRepository {
  saveProduct(product: Product): Promise<number>
  findProductByParam(param: string, value: unknown): Promise<Product>
  removeProduct(id: number): Promise<void>
}
