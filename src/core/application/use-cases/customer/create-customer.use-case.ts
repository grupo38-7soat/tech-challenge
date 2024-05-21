import {
  CreateCustomerInput,
  CreateCustomerOutput,
  ICreateCustomerUseCase,
} from '../types/customer'

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor() {}

  async execute(input: CreateCustomerInput): Promise<CreateCustomerOutput> {
    console.log('input => ', input)
    return { customerId: '12345' }
  }
}
