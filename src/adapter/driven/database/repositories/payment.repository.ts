import { Payment, PaymentCurrentStatus } from '@core/domain/entities'
import { IPaymentRepository, PaymentParams } from '@core/domain/repositories'
import { DomainException } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

export class PaymentRepository implements IPaymentRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.payment'
    console.log(this.postgresConnectionAdapter)
  }

  async savePayment(Payment: Payment): Promise<void> {
    console.log(Payment)
    throw new DomainException('savePayment not implemented.')
  }

  async updatePaymentStatus(status: PaymentCurrentStatus): Promise<Payment> {
    console.log(status)
    throw new DomainException('updatePaymentStatus not implemented.')
  }

  async findAllPayments(params?: PaymentParams): Promise<Payment[]> {
    console.log(params)
    throw new DomainException('findAllPayments not implemented.')
  }
}
