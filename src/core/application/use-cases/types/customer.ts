export type CreateCustomerInput = {
  name: string
  email: string
  document: string
}

export type CreateCustomerOutput = {
  customerId: string
}

export type GetCustomerByDocumentInput = {
  document: string
}

export type GetCustomerByDocumentOutput = {
  customerId: string
  name: string
  email: string
  document: string
  createdAt: string
}

export interface ICreateCustomerUseCase {
  execute(input: CreateCustomerInput): Promise<CreateCustomerOutput>
}

export interface IGetCustomerByDocumentUseCase {
  execute(
    input: GetCustomerByDocumentInput,
  ): Promise<GetCustomerByDocumentOutput>
}
