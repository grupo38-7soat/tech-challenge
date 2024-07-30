import { IOrderRepository, IPaymentRepository } from '@core/domain/repositories'
import { OrderCurrentStatus, PaymentCurrentStatus } from '@core/domain/entities'
import { formatDateWithTimezone } from '@core/application/helpers'
import {
  IListenOrderPaymentUseCase,
  ListenOrderPaymentInput,
} from '../types/order'
import {
  ExternalPaymentStatus,
  IPaymentSolution,
} from '../types/payment-solution'

export class ListenOrderPaymentUseCase implements IListenOrderPaymentUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentSolution: IPaymentSolution,
  ) {}

  async execute({
    action,
    externalPaymentId,
  }: ListenOrderPaymentInput): Promise<void> {
    if (!action || !externalPaymentId) return
    const [, currentAction] = action.split('.')
    if (currentAction !== 'updated') return
    const payment =
      await this.paymentRepository.findPaymentByExternalId(externalPaymentId)
    if (!payment) return
    const order = await this.orderRepository.findOrderByPaymentId(
      payment.getId(),
    )
    if (!order) return
    const externalPayment = await this.paymentSolution.findPayment(
      Number(externalPaymentId),
    )
    if (!externalPayment) return
    const currentDate = formatDateWithTimezone(new Date())
    if (
      externalPayment.status === ExternalPaymentStatus.cancelled ||
      externalPayment.status === ExternalPaymentStatus.rejected
    ) {
      if (payment.getPaymentStatus() === PaymentCurrentStatus.REJEITADO) return
      payment.rejectPayment()
      await this.paymentRepository.updatePaymentStatus(
        payment.getId(),
        payment.getPaymentStatus(),
        currentDate,
      )
      order.cancelOrder()
      await this.orderRepository.updateOrderStatus(
        order.getId(),
        OrderCurrentStatus.CANCELADO,
        currentDate,
      )
      return
    }
    if (externalPayment.status === ExternalPaymentStatus.approved) {
      if (payment.getPaymentStatus() === PaymentCurrentStatus.AUTORIZADO) return
      payment.authorizePayment()
      await this.paymentRepository.updatePaymentStatus(
        payment.getId(),
        payment.getPaymentStatus(),
        currentDate,
      )
    }
  }
}
