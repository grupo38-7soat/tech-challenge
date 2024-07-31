import { DomainException, ExceptionCause } from '../base'
import { Order, OrderCurrentStatus } from '../entities'

abstract class OrderStatus {
  public value: OrderCurrentStatus

  constructor(readonly order: Order) {}

  receive(): void {
    throw new DomainException(
      'Status não permitido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  init(): void {
    throw new DomainException(
      'Status não permitido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  ready(): void {
    throw new DomainException(
      'Status não permitido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  finish(): void {
    throw new DomainException(
      'Status não permitido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }

  cancel(): void {
    throw new DomainException(
      'Status não permitido',
      ExceptionCause.BUSINESS_EXCEPTION,
    )
  }
}

class ReceivedOrderStatus extends OrderStatus {
  value: OrderCurrentStatus

  constructor(order: Order) {
    super(order)
    this.value = OrderCurrentStatus.RECEBIDO
  }

  init(): void {
    this.order.setStatus(new InProgressOrderStatus(this.order))
  }

  cancel(): void {
    this.order.setStatus(new CancelledOrderStatus(this.order))
  }
}

class InProgressOrderStatus extends OrderStatus {
  value: OrderCurrentStatus

  constructor(order: Order) {
    super(order)
    this.value = OrderCurrentStatus.EM_PREPARO
  }

  ready(): void {
    this.order.setStatus(new ReadyOrderStatus(this.order))
  }

  cancel(): void {
    this.order.setStatus(new CancelledOrderStatus(this.order))
  }
}

class ReadyOrderStatus extends OrderStatus {
  value: OrderCurrentStatus

  constructor(order: Order) {
    super(order)
    this.value = OrderCurrentStatus.PRONTO
  }

  finish(): void {
    this.order.setStatus(new FinishedOrderStatus(this.order))
  }
}

class FinishedOrderStatus extends OrderStatus {
  value: OrderCurrentStatus

  constructor(order: Order) {
    super(order)
    this.value = OrderCurrentStatus.FINALIZADO
  }
}

class CancelledOrderStatus extends OrderStatus {
  value: OrderCurrentStatus

  constructor(order: Order) {
    super(order)
    this.value = OrderCurrentStatus.CANCELADO
  }
}

class OrderStatusFactory {
  static create(Order: Order, status: OrderCurrentStatus) {
    const Orders = {
      [OrderCurrentStatus.RECEBIDO]: new ReceivedOrderStatus(Order),
      [OrderCurrentStatus.EM_PREPARO]: new InProgressOrderStatus(Order),
      [OrderCurrentStatus.PRONTO]: new ReadyOrderStatus(Order),
      [OrderCurrentStatus.FINALIZADO]: new FinishedOrderStatus(Order),
      [OrderCurrentStatus.CANCELADO]: new CancelledOrderStatus(Order),
    }
    return Orders[status]
  }
}

export { OrderStatus, OrderStatusFactory }
