import { Category } from '@core/domain/entities'

export type CreateProductInput = {
  name: string
  description: string
  price: number
  category: Category
  imageLinks: string[]
}

export type CreateProductOutput = {
  id: number
}

export type UpdateProductInput = {
  id: number
  name: string
  description: string
  price: number
  category: Category
  imageLinks: string[]
}

export type UpdateProductOutput = {
  id: number
}

export type SearchProductInput = {}

export type SearchProductOutput = {}

export type RemoveProductInput = {
  id: number
}

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
  execute(input: RemoveProductInput): Promise<void>
}
