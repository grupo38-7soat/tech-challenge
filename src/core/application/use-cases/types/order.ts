import {
  OrderCurrentStatus,
  PaymentCurrentStatus,
  PaymentType,
} from '@core/domain/entities'

type Item = {
  id: number
  quantity: number
  observation?: string
}

type Payment = {
  type: PaymentType
}

export type MakeCheckoutInput = {
  customerId?: string
  items: Item[]
  orderAmount: number
  payment: Payment
}

export type MakeCheckoutOutput = {
  order: {
    id: number
    status: OrderCurrentStatus
    effectiveDate: string
    totalAmount: number
  }
  payment: {
    id: string
    status: PaymentCurrentStatus
    type: PaymentType
  }
  customer?: {
    id: string
    name: string
    email: string
    document: string
  }
}

export type SearchOrdersInput = {
  id: number
  status: OrderCurrentStatus
}

export type SearchOrdersOutput = {
  id: number
  status: OrderCurrentStatus
  effectiveDate: string
  totalAmount: number
  paymentId: string
  customerId: string
}

export interface IMakeCheckoutUseCase {
  execute(input: MakeCheckoutInput): Promise<MakeCheckoutOutput>
}

export interface ISearchOrdersUseCase {
  execute(input: SearchOrdersInput): Promise<SearchOrdersOutput[]>
}
