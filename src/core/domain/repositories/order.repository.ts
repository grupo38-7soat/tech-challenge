import { Order, OrderCurrentStatus } from '../entities'

export type OrderParams = {
  [field: string]: {
    exactMatch: boolean
    value: unknown
  }
}

export interface IOrderRepository {
  saveOrder(order: Order): Promise<number>
  updateOrderStatus(status: OrderCurrentStatus): Promise<void>
  findAllOrders(params?: OrderParams): Promise<Order[]>
}
