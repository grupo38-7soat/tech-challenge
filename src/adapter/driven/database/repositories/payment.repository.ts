import { Payment, PaymentCurrentStatus } from '@core/domain/entities'
import { IPaymentRepository, PaymentParams } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

export class PaymentRepository implements IPaymentRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.payment'
    console.log(this.postgresConnectionAdapter)
  }

  async savePayment(payment: Payment): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query(
        `
          INSERT INTO ${this.table}(id, effective_date, type)
          VALUES($1::uuid, $2::timestamp, $3::fast_food.payment_type_enum)
        `,
        [payment.getId(), payment.getEffectiveDate(), payment.getType()],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao criar pagamento',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentCurrentStatus,
  ): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query(
        `
          UPDATE ${this.table} SET status = $1::fast_food.payment_status_enum,
          updated_at = current_timestamp WHERE id = $2::uuid
        `,
        [status, id],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao atualizar o status do pagamento',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findAllPayments(params?: PaymentParams): Promise<Payment[]> {
    console.log(params)
    throw new DomainException('findAllPayments not implemented.')
  }
}
