import { randomUUID } from 'crypto'
import { Customer } from '@core/domain/entities'
import { ICustomerRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  CreateCustomerInput,
  CreateCustomerOutput,
  ICreateCustomerUseCase,
} from '../types/customer'

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
    const customer =
      await this.customerRepository.findCustomerByDocument(document)
    if (customer) {
      throw new DomainException(
        'Cliente já existe na base',
        ExceptionCause.INVALID_DATA,
      )
    }
    const id = randomUUID()
    const newCustomer = new Customer(document, name, email, id)
    await this.customerRepository.saveCustomer(newCustomer)
    return { id }
  }
}
