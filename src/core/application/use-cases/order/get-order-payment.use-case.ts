import { DomainException, ExceptionCause } from '@core/domain/base'
import { IPaymentRepository } from '@core/domain/repositories'
import {
  GetOrderPaymentInput,
  GetOrderPaymentOutput,
  IGetOrderPaymentUseCase,
} from '../types/order'

export class GetOrderPaymentUseCase implements IGetOrderPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute({
    orderId,
  }: GetOrderPaymentInput): Promise<GetOrderPaymentOutput> {
    if (!orderId) {
      throw new DomainException(
        'O status deve ser válido',
        ExceptionCause.MISSING_DATA,
      )
    }
    const payment = await this.paymentRepository.findPaymentByOrderId(orderId)
    if (!payment) {
      throw new DomainException(
        'Pagamento não encontrado',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    const { id, type, paymentStatus: status, effectiveDate } = payment.toJson()
    return {
      id,
      type,
      status,
      effectiveDate,
    }
  }
}
