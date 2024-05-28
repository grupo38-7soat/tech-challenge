import { IProductRepository } from '@core/domain/repositories'
import { Category, Product } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { someEmptyField } from '@core/application/helpers'
import {
  CreateProductInput,
  CreateProductOutput,
  ICreateProductUseCase,
} from '../types/product'

export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const { name, description, price, category, imageLinks } = input
    if (someEmptyField([name, description, price, category, imageLinks])) {
      throw new DomainException(
        'Todos campos obrigatórios devem ser informados',
        ExceptionCause.MISSING_DATA,
      )
    }
    if (!(category in Category)) {
      throw new DomainException(
        'A categoria deve ser válida',
        ExceptionCause.INVALID_DATA,
      )
    }
    const product = new Product(name, description, price, category, imageLinks)
    const id = await this.productRepository.saveProduct(product)
    return { id }
  }
}
