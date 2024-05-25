import { ICustomerRepository } from '@core/domain/repositories'
import { Customer } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

interface CustomerData {
  id: string
  name: string
  email: string
  document: string
  created_at: string
  updated_at: string
}

export class CustomerRepository implements ICustomerRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.customer'
  }

  async saveCustomer(customer: Customer): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query(
        `
          INSERT INTO ${this.table}(id, document, name, email)
          VALUES($1::uuid, $2::text, $3::text, $4::text)
        `,
        [
          customer.getId(),
          customer.getDocument(),
          customer.getName(),
          customer.getEmail(),
        ],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao criar cliente',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findCustomerByDocument(document: string): Promise<Customer> {
    try {
      const { rows } = await this.postgresConnectionAdapter.query<CustomerData>(
        `SELECT * FROM ${this.table} WHERE document = $1::text LIMIT 1`,
        [document],
      )
      if (!rows || !rows.length) return null
      return new Customer(
        rows[0].document,
        rows[0].name,
        rows[0].email,
        rows[0].id,
        rows[0].created_at,
        rows[0].updated_at,
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao consultar cliente',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }
}
