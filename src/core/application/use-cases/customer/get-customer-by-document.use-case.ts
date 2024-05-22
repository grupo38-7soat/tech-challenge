import { ICustomerRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  GetCustomerByDocumentInput,
  GetCustomerByDocumentOutput,
  IGetCustomerByDocumentUseCase,
} from '../types/customer'

export class GetCustomerByDocumentUseCase
  implements IGetCustomerByDocumentUseCase
{
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute({
    document,
  }: GetCustomerByDocumentInput): Promise<GetCustomerByDocumentOutput> {
    if (!document) {
      throw new DomainException(
        'O cpf não pode ser vazio',
        ExceptionCause.MISSING_DATA,
      )
    }
    const customer =
      await this.customerRepository.findCustomerByDocument(document)
    if (!customer) {
      throw new DomainException(
        'Cliente não encontrado',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    const {
      id: customerId,
      document: customerDocument,
      name,
      email,
      createdAt,
      updatedAt,
    } = customer.toJson()
    return {
      customerId,
      document: customerDocument,
      name,
      email,
      createdAt,
      updatedAt,
    }
  }
}
