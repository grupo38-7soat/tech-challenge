import {
  UpdateProductInput,
  UpdateProductOutput,
  IUpdateProductUseCase,
} from '../types/product'

export class UpdateProductUseCase implements IUpdateProductUseCase {
  execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
