import { ICustomerRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  CreateCustomerInput,
  CreateCustomerOutput,
  ICreateCustomerUseCase,
} from '../types/customer'
import { Customer } from '@core/domain/entities'

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute({
    document,
    name,
    email,
  }: CreateCustomerInput): Promise<CreateCustomerOutput> {
    if (!document || !name || !email) {
      throw new DomainException(
        'Todos os campos obrigatórios devem ser enviados',
        ExceptionCause.MISSING_DATA,
      )
    }
    const newCustomer = new Customer(
      document,
      name,
      email,
      new Date().toISOString(),
      new Date().toISOString(),
    )
    const id = await this.customerRepository.saveCustomer(newCustomer)
    return { id }
  }
}
