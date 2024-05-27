import { Payment, PaymentCurrentStatus } from '../entities'

export type PaymentParams = {
  [field: string]: {
    exactMatch: boolean
    value: unknown
  }
}

export interface IPaymentRepository {
  savePayment(Payment: Payment): Promise<void>
  updatePaymentStatus(status: PaymentCurrentStatus): Promise<Payment>
  findAllPayments(params?: PaymentParams): Promise<Payment[]>
}
