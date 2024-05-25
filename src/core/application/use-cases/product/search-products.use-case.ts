import { IProductRepository, ProductParams } from '@core/domain/repositories'
import { Category } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  SearchProductsInput,
  SearchProductsOutput,
  ISearchProductsUseCase,
} from '../types/product'

export class SearchProductsUseCase implements ISearchProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({
    id,
    name,
    category,
  }: SearchProductsInput): Promise<SearchProductsOutput[]> {
    const params: ProductParams = {}
    if (id) params.id = { exactMatch: true, value: id }
    if (name) params.name = { exactMatch: false, value: name }
    if (category) {
      if (!(category in Category)) {
        throw new DomainException(
          'A categoria deve ser válida',
          ExceptionCause.INVALID_DATA,
        )
      }
      params.category = { exactMatch: true, value: category }
    }
    const products = await this.productRepository.findAllProducts(params)
    return products.map(product => {
      const {
        id,
        name,
        description,
        category,
        price,
        imageLinks,
        createdAt,
        updatedAt,
      } = product.toJson()
      return {
        id,
        name,
        description,
        category,
        price,
        imageLinks,
        createdAt,
        updatedAt,
      }
    })
  }
}
