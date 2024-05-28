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

type OrderItem = {
  product: Product
  quantity: number
  observation: string
}

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
    const orderItems: OrderItem[] = []
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
      orderItems.push({
        product,
        quantity: item.quantity,
        observation: item.observation,
      })
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
    await this.paymentRepository.savePayment(orderPayment)
    // TODO: adicionar meio de pagamento nesse ponto futuramente
    orderPayment.authorizePayment()
    await this.paymentRepository.updatePaymentStatus(
      orderPaymentId,
      orderPayment.getPaymentStatus(),
    )
    const order = new Order(
      orderAmount,
      OrderCurrentStatus.RECEBIDO,
      this.transformOrderItemsToProducts(orderItems),
      orderPayment,
      customer,
    )
    const orderId = await this.orderRepository.saveOrder(order)
    for (const item of orderItems) {
      await this.orderRepository.saveOrderProduct({
        orderId,
        productId: item.product.getId(),
        quantity: item.quantity,
        price: item.product.getPrice(),
        observation: item.observation,
      })
    }
    const {
      status,
      totalAmount,
      payment: serializedPayment,
      customer: serializedCustomer,
    } = order.toJson()
    return {
      order: {
        id: orderId,
        status,
        effectiveDate: currentDate,
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
    }
  }

  private transformOrderItemsToProducts(orderItems: OrderItem[]): Product[] {
    const products: Product[] = []
    orderItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        products.push(item.product)
      }
    })
    return products
  }
}
