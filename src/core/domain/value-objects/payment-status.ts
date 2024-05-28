import { DomainException, ExceptionCause } from '../base'
import { Payment, PaymentCurrentStatus } from '../entities'

abstract class PaymentStatus {
  public value: PaymentCurrentStatus

  constructor(readonly payment: Payment) {}

  request(): void {
    throw new DomainException(
      'Status de pagamento inválido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  authorize(): void {
    throw new DomainException(
      'Status de pagamento inválido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  reject(): void {
    throw new DomainException(
      'Status de pagamento inválido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  refund(): void {
    throw new DomainException(
      'Status de pagamento inválido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }
}

class RequestedPaymentStatus extends PaymentStatus {
  value: PaymentCurrentStatus

  constructor(payment: Payment) {
    super(payment)
    this.value = PaymentCurrentStatus.PENDENTE
  }

  authorize(): void {
    this.payment.setPaymentStatus(new AuthorizedPaymentStatus(this.payment))
  }

  reject(): void {
    this.payment.setPaymentStatus(new RejectedPaymentStatus(this.payment))
  }
}

class AuthorizedPaymentStatus extends PaymentStatus {
  value: PaymentCurrentStatus

  constructor(payment: Payment) {
    super(payment)
    this.value = PaymentCurrentStatus.AUTORIZADO
  }

  refund(): void {
    this.payment.setPaymentStatus(new RefundedPaymentStatus(this.payment))
  }
}

class RejectedPaymentStatus extends PaymentStatus {
  value: PaymentCurrentStatus

  constructor(payment: Payment) {
    super(payment)
    this.value = PaymentCurrentStatus.REJEITADO
  }
}

class RefundedPaymentStatus extends PaymentStatus {
  value: PaymentCurrentStatus

  constructor(payment: Payment) {
    super(payment)
    this.value = PaymentCurrentStatus.REEMBOLSADO
  }
}

class PaymentStatusFactory {
  static create(payment: Payment, status: PaymentCurrentStatus) {
    const payments = {
      [PaymentCurrentStatus.PENDENTE]: new RequestedPaymentStatus(payment),
      [PaymentCurrentStatus.AUTORIZADO]: new AuthorizedPaymentStatus(payment),
      [PaymentCurrentStatus.REJEITADO]: new RejectedPaymentStatus(payment),
      [PaymentCurrentStatus.REEMBOLSADO]: new RefundedPaymentStatus(payment),
    }
    return payments[status]
  }
}

export { PaymentStatus, PaymentStatusFactory }
