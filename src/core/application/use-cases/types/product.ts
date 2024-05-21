export type CreateProductInput = {}

export type CreateProductOutput = {}

export type UpdateProductInput = {}

export type UpdateProductOutput = {}

export type SearchProductInput = {}

export type SearchProductOutput = {}

export type RemoveProductInput = {}

export type RemoveProductOutput = {}

export interface ICreateProductUseCase {
  execute(input: CreateProductInput): Promise<CreateProductOutput>
}

export interface IUpdateProductUseCase {
  execute(input: UpdateProductInput): Promise<UpdateProductOutput>
}

export interface ISearchProductUseCase {
  execute(input: SearchProductInput): Promise<SearchProductOutput>
}

export interface IRemoveProductUseCase {
  execute(input: RemoveProductInput): Promise<RemoveProductOutput>
}
