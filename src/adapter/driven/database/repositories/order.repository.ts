import { Order, OrderCurrentStatus } from '@core/domain/entities'
import {
  IOrderRepository,
  OrderParams,
  OrderProduct,
} from '@core/domain/repositories'
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
        'Erro ao criar pedido',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async saveOrderProduct({
    orderId,
    productId,
    quantity,
    price,
    observation,
  }: OrderProduct): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query<{ id: number }>(
        `
          INSERT INTO fast_food.product_order(order_id, product_id, quantity, unit_price, observation)
          VALUES($1::integer, $2::integer, $3::integer, $4::numeric, $5::text)
        `,
        [orderId, productId, quantity, price, observation],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao salvar produto do pedido',
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
