import { IProductRepository } from '@core/domain/repositories'
import { Product } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  CreateProductInput,
  CreateProductOutput,
  ICreateProductUseCase,
} from '../types/product'

export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const { name, description, price, category, imageLinks } = input
    if (this.someEmptyField([name, description, price, category, imageLinks])) {
      throw new DomainException(
        'Todos campos obrigatórios devem ser informados',
        ExceptionCause.MISSING_DATA,
      )
    }
    const product = new Product(name, description, price, category, imageLinks)
    const id = await this.productRepository.saveProduct(product)
    return { id }
  }

  private someEmptyField(fields: unknown[]): boolean {
    return fields.some(field => !field)
  }
}
