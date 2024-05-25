import { Category, Product } from '../entities'

export interface IProductRepository {
  saveProduct(product: Product): Promise<number>
  findProductByCategory(category: Category): Promise<Product>
  removeProduct(id: number): Promise<void>
}
