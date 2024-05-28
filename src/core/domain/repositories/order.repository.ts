import { Order, OrderCurrentStatus } from '../entities'

export type OrderParams = {
  [field: string]: {
    exactMatch: boolean
    value: unknown
  }
}

export type OrderProduct = {
  orderId: number
  productId: number
  quantity: number
  price: number
  observation?: string
}

export interface IOrderRepository {
  saveOrder(order: Order): Promise<number>
  saveOrderProduct(orderProduct: OrderProduct): Promise<void>
  updateOrderStatus(status: OrderCurrentStatus): Promise<void>
  findAllOrders(params?: OrderParams): Promise<Order[]>
}
