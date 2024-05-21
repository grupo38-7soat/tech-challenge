import {
  ISearchOrdersUseCase,
  SearchOrdersInput,
  SearchOrdersOutput,
} from '../types/order'

export class SearchOrdersUseCase implements ISearchOrdersUseCase {
  execute(input: SearchOrdersInput): Promise<SearchOrdersOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
