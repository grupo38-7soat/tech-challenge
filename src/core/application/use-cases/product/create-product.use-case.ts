import {
  CreateProductInput,
  CreateProductOutput,
  ICreateProductUseCase,
} from '../types/product'

export class CreateProductUseCase implements ICreateProductUseCase {
  execute(input: CreateProductInput): Promise<CreateProductOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
