export type MakeCheckoutInput = {}

export type MakeCheckoutOutput = {}

export type SearchOrdersInput = {}

export type SearchOrdersOutput = {}

export interface IMakeCheckoutUseCase {
  execute(input: MakeCheckoutInput): Promise<MakeCheckoutOutput>
}

export interface ISearchOrdersUseCase {
  execute(input: SearchOrdersInput): Promise<SearchOrdersOutput>
}
