import { Order, OrderCurrentStatus } from '@core/domain/entities'
import { IOrderRepository, OrderParams } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

export class OrderRepository implements IOrderRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.order'
    console.log(this.postgresConnectionAdapter)
  }

  async saveOrder(order: Order): Promise<number> {
    try {
      const customerId = order.getCustomer()
        ? order.getCustomer().getId()
        : null
      const result = await this.postgresConnectionAdapter.query<{ id: number }>(
        `
          INSERT INTO ${this.table}(total_amount, status, payment_id, customer_id)
          VALUES($1::numeric, $2::fast_food.order_status_enum, $3::uuid, $4::uuid)
          RETURNING id
        `,
        [
          order.getTotalAmount(),
          order.getStatus(),
          order.getPayment().getId(),
          customerId,
        ],
      )
      return Number(result.rows[0]?.id)
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao criar pagamento',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async updateOrderStatus(status: OrderCurrentStatus): Promise<void> {
    console.log(status)
    throw new DomainException('updateOrderStatus not implemented.')
  }

  async findAllOrders(params?: OrderParams): Promise<Order[]> {
    console.log(params)
    throw new DomainException('findAllOrders not implemented.')
  }
}
