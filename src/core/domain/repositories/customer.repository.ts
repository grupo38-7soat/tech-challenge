import { Customer } from '../entities'

export interface ICustomerRepository {
  saveCustomer(customer: Customer): Promise<string>
  findCustomerByDocument(document: string): Promise<Customer>
}
