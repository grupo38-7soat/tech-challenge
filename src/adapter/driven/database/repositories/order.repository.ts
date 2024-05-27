import { Order, OrderCurrentStatus } from '@core/domain/entities'
import { IOrderRepository, OrderParams } from '@core/domain/repositories'
import { DomainException } from '@core/domain/base'
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
    console.log(order)
    throw new DomainException('saveOrder not implemented.')
  }

  async updateOrderStatus(status: OrderCurrentStatus): Promise<Order> {
    console.log(status)
    throw new DomainException('updateOrderStatus not implemented.')
  }

  async findAllOrders(params?: OrderParams): Promise<Order[]> {
    console.log(params)
    throw new DomainException('findAllOrders not implemented.')
  }
}
