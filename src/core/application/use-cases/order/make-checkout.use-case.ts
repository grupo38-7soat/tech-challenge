import { randomUUID } from 'crypto'
import {
  Customer,
  Order,
  OrderCurrentStatus,
  Payment,
  PaymentCurrentStatus,
  PaymentType,
  Product,
} from '@core/domain/entities'
import {
  ICustomerRepository,
  IProductRepository,
  IPaymentRepository,
  IOrderRepository,
} from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  IMakeCheckoutUseCase,
  MakeCheckoutInput,
  MakeCheckoutOutput,
} from '../types/order'

export class MakeCheckoutUseCase implements IMakeCheckoutUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly productRepository: IProductRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute({
    customerId,
    items,
    orderAmount,
    payment,
  }: MakeCheckoutInput): Promise<MakeCheckoutOutput> {
    let customer: Customer
    if (customerId) {
      customer = await this.customerRepository.findCustomerByParam(
        'id',
        customerId,
      )
      if (!customer) {
        throw new DomainException(
          'Cliente não encontrado',
          ExceptionCause.NOTFOUND_EXCEPTION,
        )
      }
    }
    const orderItems: Product[] = []
    for (const item of items) {
      const product = await this.productRepository.findProductByParam(
        'id',
        item.id,
      )
      if (!product) {
        throw new DomainException(
          `Produto ${item.id} não encontrado`,
          ExceptionCause.NOTFOUND_EXCEPTION,
        )
      }
      orderItems.push(product)
    }
    const currentDate = new Date().toISOString()
    const orderPaymentId = randomUUID()
    if (!(payment.type in PaymentType)) {
      throw new DomainException(
        'Informe uma opção de pagamento válida',
        ExceptionCause.INVALID_DATA,
      )
    }
    const orderPayment = new Payment(
      payment.type,
      PaymentCurrentStatus.PENDENTE,
      currentDate,
      orderPaymentId,
    )
    await this.paymentRepository.savePayment(orderPayment) // TODO: parei aqui
    // TODO: adicionar meio de pagamento nesse ponto futuramente
    // orderPayment.authorizePayment()
    // await this.paymentRepository.updatePaymentStatus(
    //   orderPayment.getPaymentStatus(),
    // )
    const order = new Order(
      currentDate,
      orderAmount,
      OrderCurrentStatus.RECEBIDO,
      orderItems,
      orderPayment,
      customer,
    )
    const orderId = await this.orderRepository.saveOrder(order)
    const {
      status,
      effectiveDate,
      totalAmount,
      payment: serializedPayment,
      customer: serializedCustomer,
    } = order.toJson()
    return {
      order: {
        id: orderId,
        status,
        effectiveDate,
        totalAmount,
      },
      payment: {
        id: orderPaymentId,
        status: serializedPayment.paymentStatus,
        type: serializedPayment.type,
      },
      customer: {
        id: serializedCustomer.id,
        document: serializedCustomer.document,
        name: serializedCustomer.name,
        email: serializedCustomer.email,
      },
      createdAt: order.getCreatedAt(),
    }
  }
}
