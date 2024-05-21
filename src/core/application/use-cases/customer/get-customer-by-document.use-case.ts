import {
  GetCustomerByDocumentInput,
  GetCustomerByDocumentOutput,
  IGetCustomerByDocumentUseCase,
} from '../types/customer'

export class GetCustomerByDocumentUseCase
  implements IGetCustomerByDocumentUseCase
{
  constructor() {}

  async execute(
    input: GetCustomerByDocumentInput,
  ): Promise<GetCustomerByDocumentOutput> {
    console.log('input => ', input)
    return {
      customerId: '12345',
      name: 'some_info',
      email: 'some_info',
      document: 'some_info',
      createdAt: 'some_info',
    }
  }
}
