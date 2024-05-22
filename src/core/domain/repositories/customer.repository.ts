import { Customer } from '../entities'

export interface ICustomerRepository {
  saveCustomer(customer: Customer): Promise<void>
  findCustomerByDocument(document: string): Promise<Customer>
}
