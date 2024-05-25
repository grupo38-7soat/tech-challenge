import { IProductRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { RemoveProductInput, IRemoveProductUseCase } from '../types/product'

export class RemoveProductUseCase implements IRemoveProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ id }: RemoveProductInput): Promise<void> {
    if (!id) {
      throw new DomainException(
        'O id deve ser informado',
        ExceptionCause.MISSING_DATA,
      )
    }
    const product = await this.productRepository.findProductByParam('id', id)
    if (!product) {
      throw new DomainException(
        'Produto não encontrado',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    await this.productRepository.removeProduct(id)
  }
}
