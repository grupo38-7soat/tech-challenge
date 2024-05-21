import {
  RemoveProductInput,
  RemoveProductOutput,
  IRemoveProductUseCase,
} from '../types/product'

export class RemoveProductUseCase implements IRemoveProductUseCase {
  execute(input: RemoveProductInput): Promise<RemoveProductOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
