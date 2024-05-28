import { IOrderRepository, OrderParams } from '@core/domain/repositories'
import { OrderCurrentStatus } from '@core/domain/entities'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  ISearchOrdersUseCase,
  SearchOrdersInput,
  SearchOrdersOutput,
} from '../types/order'

export class SearchOrdersUseCase implements ISearchOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute({
    id,
    status,
  }: SearchOrdersInput): Promise<SearchOrdersOutput[]> {
    const params: OrderParams = {}
    if (id) params.id = { exactMatch: true, value: id }
    if (status) {
      if (!(status in OrderCurrentStatus)) {
        throw new DomainException(
          'O status deve ser válido',
          ExceptionCause.INVALID_DATA,
        )
      }
      params.status = { exactMatch: true, value: status }
    }
    const orders = await this.orderRepository.findAllOrders(params)
    return orders.map(order => {
      const { id, status, effectiveDate, totalAmount, payment, customer } =
        order.toJson()
      return {
        id,
        status,
        effectiveDate,
        totalAmount,
        paymentId: payment.id,
        customerId: customer.id,
      }
    })
  }
}
