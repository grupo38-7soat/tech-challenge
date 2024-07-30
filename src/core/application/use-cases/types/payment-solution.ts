export interface PaymentInput {
  payment_method_id: string
  transaction_amount: number
  notification_url: string
  date_of_expiration?: string
  payer: {
    entity_type?: 'individual' | 'association'
    type?: 'customer' | 'registered' | 'guest'
    first_name?: string
    last_name?: string
    email: string
    identification?: {
      type: string
      number: string
    }
    phone?: {
      area_code: number
      number: string
    }
  }
  description: string
  installments: number
  additional_info: {
    items: Array<{
      id: string
      title: string
      description: string
      picture_url: string
      category_id: string
      quantity: number
      unit_price: number
    }>
    payer: {
      first_name: string
      phone?: {
        area_code: number
        number: string
      }
    }
  }
}

export type PaymentOutput = {
  additional_info: {
    items: Array<{
      category_id: string
      description: string
      id: string
      picture_url: string
      quantity: string
      title: string
      unit_price: string
    }>
    payer: {
      first_name: string
    }
  }
  collector_id: number
  coupon_amount: number
  currency_id: string
  date_approved: unknown
  date_created: string
  date_last_updated: string
  date_of_expiration: string
  description: string
  external_reference: unknown
  id: number
  installments: number
  issuer_id: string
  notification_url: string
  operation_type: string
  payment_method: {
    id: string
    issuer_id: string
    type: string
  }
  payment_method_id: string
  payment_type_id: string
  status: string
  status_detail: string
  transaction_amount: number
  transaction_amount_refunded: number
}

export interface IPaymentSolution {
  createPayment(input: PaymentInput): Promise<PaymentOutput>
  findPayment(paymentId: number): Promise<PaymentOutput>
}
