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

export type SearchProductsInput = {
  id: number
  name: string
  category: string
}

export type SearchProductsOutput = {
  id: number
  name: string
  description: string
  category: Category
  price: number
  imageLinks: string[]
  createdAt: string
  updatedAt: string
}

export type RemoveProductInput = {
  id: number
}

export interface ICreateProductUseCase {
  execute(input: CreateProductInput): Promise<CreateProductOutput>
}

export interface IUpdateProductUseCase {
  execute(input: UpdateProductInput): Promise<UpdateProductOutput>
}

export interface ISearchProductsUseCase {
  execute(input: SearchProductsInput): Promise<SearchProductsOutput[]>
}

export interface IRemoveProductUseCase {
  execute(input: RemoveProductInput): Promise<void>
}
