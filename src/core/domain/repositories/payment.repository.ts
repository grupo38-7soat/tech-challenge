import { Payment, PaymentCurrentStatus } from '../entities'

export type PaymentParams = {
  [field: string]: {
    exactMatch: boolean
    value: unknown
  }
}

export interface IPaymentRepository {
  savePayment(Payment: Payment): Promise<void>
  updatePaymentStatus(id: string, status: PaymentCurrentStatus): Promise<void>
  findAllPayments(params?: PaymentParams): Promise<Payment[]>
  findPaymentByOrderId(orderId: number): Promise<Payment>
}
