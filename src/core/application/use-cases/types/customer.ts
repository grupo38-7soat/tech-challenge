export type CreateCustomerInput = {
  name: string
  email: string
  document: string
}

export type CreateCustomerOutput = {
  id: string
}

export type GetCustomerByDocumentInput = {
  document: string
}

export type GetCustomerByDocumentOutput = {
  id: string
  name: string
  email: string
  document: string
  createdAt: string
  updatedAt: string
}

export interface ICreateCustomerUseCase {
  execute(input: CreateCustomerInput): Promise<CreateCustomerOutput>
}

export interface IGetCustomerByDocumentUseCase {
  execute(
    input: GetCustomerByDocumentInput,
  ): Promise<GetCustomerByDocumentOutput>
}
