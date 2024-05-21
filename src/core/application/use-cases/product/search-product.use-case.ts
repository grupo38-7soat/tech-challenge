import {
  SearchProductInput,
  SearchProductOutput,
  ISearchProductUseCase,
} from '../types/product'

export class SearchProductUseCase implements ISearchProductUseCase {
  execute(input: SearchProductInput): Promise<SearchProductOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
