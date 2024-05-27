import { DomainException, ExceptionCause } from '../base'
import { OrderStatus, OrderStatusFactory } from '../value-objects'
import { Customer, SerializedCustomer } from './customer'
import { Payment, PaymentCurrentStatus, SerializedPayment } from './payment'
import { Product, SerializedProduct } from './product'

export enum OrderCurrentStatus {
  RECEBIDO = 'RECEBIDO',
  EM_PREPARO = 'EM_PREPARO',
  PRONTO = 'PRONTO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

type SerializedOrder = {
  id: number
  effectiveDate: string
  totalAmount: number
  status: OrderCurrentStatus
  customer?: SerializedCustomer
  items: SerializedProduct[]
  payment: SerializedPayment
}

export class Order {
  private id: number
  private effectiveDate: string
  private totalAmount: number
  private status: OrderStatus
  private customer?: Customer
  private items: Product[]
  private payment: Payment
  private createdAt: string
  private updatedAt: string

  constructor(
    effectiveDate: string,
    totalAmount: number,
    status: OrderCurrentStatus,
    items: Product[],
    payment: Payment,
    customer?: Customer,
    id?: number,
    createdAt?: string,
    updatedAt?: string,
  ) {
    this.setId(id)
    this.setEffectiveDate(effectiveDate)
    this.setTotalAmount(totalAmount)
    this.setItems(items)
    this.setPayment(payment)
    this.setCustomer(customer)
    this.setCustomer(customer)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
    this.status = OrderStatusFactory.create(this, status)
  }

  private setId(id: number): void {
    if (id) {
      this.id = id
    }
  }

  public getId(): number {
    return this.id
  }

  private setTotalAmount(value: number): void {
    if (value < 0) {
      throw new DomainException(
        'O valor total não pode ser menor que 0',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    const allProductsAmount = this.items.reduce(
      (total, currentItem) => total + currentItem.getPrice(),
      0,
    )
    if (allProductsAmount !== value) {
      throw new DomainException(
        'O valor total deve ser válido',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.totalAmount = value
  }

  public getTotalAmount(): number {
    return this.totalAmount
  }

  private setEffectiveDate(value: string): void {
    // TODO: validar data e hora
    this.effectiveDate = value
  }

  public getEffectiveDate(): string {
    return this.effectiveDate
  }

  public setStatus(status: OrderStatus): void {
    this.status = status
  }

  public getStatus(): OrderCurrentStatus {
    return this.status.value
  }

  private setCustomer(value: Customer): void {
    if (value) {
      this.customer = value
    }
  }

  public getCustomer(): Customer {
    return this.customer
  }

  private setItems(items: Product[]): void {
    this.items = items
  }

  public getItems(): Product[] {
    return this.items
  }

  private setPayment(value: Payment): void {
    if (this.payment.getPaymentStatus() === PaymentCurrentStatus.PENDENTE) {
      throw new DomainException(
        'O pagamento precisa ser aprovado',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.payment = value
  }

  public getPayment(): Payment {
    return this.payment
  }

  private setCreatedAt(value: string): void {
    if (value) {
      this.createdAt = value
    }
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  private setUpdatedAt(value: string): void {
    if (value) {
      this.updatedAt = value
    }
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public toJson(): SerializedOrder {
    return {
      id: this.id,
      effectiveDate: this.effectiveDate,
      totalAmount: this.totalAmount,
      status: this.getStatus(),
      customer: this.customer.toJson(),
      items: [],
      payment: this.payment.toJson(),
    }
  }
}
