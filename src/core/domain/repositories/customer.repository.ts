import { Customer } from '../entities'

export interface ICustomerRepository {
  saveCustomer(customer: Customer): Promise<void>
  findCustomerByParam(param: string, value: unknown): Promise<Customer>
}
