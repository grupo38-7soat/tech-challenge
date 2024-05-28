import { IProductRepository } from '@core/domain/repositories'
import { Category, Product } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { someEmptyField } from '@core/application/helpers'
import {
  UpdateProductInput,
  UpdateProductOutput,
  IUpdateProductUseCase,
} from '../types/product'

export class UpdateProductUseCase implements IUpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    const {
      id: productId,
      name,
      description,
      price,
      category,
      imageLinks,
    } = input
    if (
      someEmptyField([
        productId,
        name,
        description,
        price,
        category,
        imageLinks,
      ])
    ) {
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
    const product = await this.productRepository.findProductByParam(
      'id',
      productId,
    )
    if (!product) {
      throw new DomainException(
        'Produto não encontrado',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    const newProduct = new Product(
      name,
      description,
      price,
      category,
      imageLinks,
      productId,
    )
    const id = await this.productRepository.saveProduct(newProduct)
    return { id }
  }
}
