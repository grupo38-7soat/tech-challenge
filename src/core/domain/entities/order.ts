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
  updatedAt?: string
}

export class Order {
  private id: number
  private totalAmount: number
  private status: OrderStatus
  private customer?: Customer
  private items: Product[]
  private payment: Payment
  private createdAt: string
  private updatedAt: string

  constructor(
    totalAmount: number,
    status: OrderCurrentStatus,
    products: Product[],
    payment: Payment,
    customer?: Customer,
    id?: number,
    createdAt?: string,
    updatedAt?: string,
  ) {
    this.status = OrderStatusFactory.create(this, status)
    this.setId(id)
    this.setProducts(products)
    this.setTotalAmount(totalAmount)
    this.setPayment(payment)
    this.setCustomer(customer)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
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
    this.totalAmount = value
  }

  public getTotalAmount(): number {
    return this.totalAmount
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

  private setProducts(items: Product[]): void {
    this.items = items
  }

  public getItems(): Product[] {
    return this.items
  }

  private setPayment(value: Payment): void {
    if (value) {
      this.payment = value
    }
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

  public initOrder(): void {
    if (this.payment.getPaymentStatus() !== PaymentCurrentStatus.AUTORIZADO) {
      throw new DomainException(
        'O pedido não pode ser iniciado. Pagamento não autorizado.',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.status.init()
  }

  public cancelOrder(): void {
    this.status.cancel()
  }

  public doneOrder(): void {
    this.status.ready()
  }

  public finishOrder(): void {
    this.status.finish()
  }

  public toJson(): SerializedOrder {
    return {
      id: this.id,
      effectiveDate: this.createdAt,
      totalAmount: this.totalAmount,
      status: this.getStatus(),
      customer: this.customer ? this.customer.toJson() : null,
      items: [],
      payment: this.payment ? this.payment.toJson() : null,
      updatedAt: this.updatedAt,
    }
  }
}
