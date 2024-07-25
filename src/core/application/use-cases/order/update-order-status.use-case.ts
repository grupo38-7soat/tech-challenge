import { DomainException, ExceptionCause } from '@core/domain/base'
import { OrderCurrentStatus } from '@core/domain/entities'
import { IOrderRepository } from '@core/domain/repositories'
import {
  IUpdateOrderStatusUseCase,
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from '../types/order'
import { formatDateWithTimezone } from '@core/application/helpers'

export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute({
    orderId,
    status,
  }: UpdateOrderStatusInput): Promise<UpdateOrderStatusOutput> {
    if (!orderId || !status) {
      throw new DomainException(
        'Os parâmetros obrigatórios devem ser informados',
        ExceptionCause.MISSING_DATA,
      )
    }
    if (
      !(status in OrderCurrentStatus) ||
      status === OrderCurrentStatus.RECEBIDO
    ) {
      throw new DomainException(
        'O status deve ser válido',
        ExceptionCause.INVALID_DATA,
      )
    }
    const currentOrder = await this.orderRepository.findOrderById(orderId)
    if (!currentOrder) {
      throw new DomainException(
        'O pedido informado não existe',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    const previousStatus = currentOrder.getStatus()
    const updateTo = {
      [OrderCurrentStatus.EM_PREPARO]: () => currentOrder.initOrder(),
      [OrderCurrentStatus.CANCELADO]: () => currentOrder.cancelOrder(),
      [OrderCurrentStatus.PRONTO]: () => currentOrder.doneOrder(),
      [OrderCurrentStatus.FINALIZADO]: () => currentOrder.finishOrder(),
    }
    updateTo[status]()
    const updatedOrder = await this.orderRepository.updateOrderStatus(
      orderId,
      status,
      formatDateWithTimezone(new Date()),
    )
    if (!updatedOrder) {
      throw new DomainException(
        'Erro ao atualizar o status do pedido',
        ExceptionCause.INVALID_DATA,
      )
    }
    const { status: currentStatus, updatedAt } = updatedOrder.toJson()
    return {
      previousStatus,
      currentStatus,
      updatedAt: formatDateWithTimezone(new Date(updatedAt)),
    }
  }
}
