import { randomUUID } from 'crypto'
import { globalEnvs } from '@config/envs/global'
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
  formatDateWithTimezone,
  increaseTimeToDate,
} from '@core/application/helpers'
import {
  IMakeCheckoutUseCase,
  MakeCheckoutInput,
  MakeCheckoutOutput,
} from '../types/order'
import { IPaymentSolution, PaymentInput } from '../types/payment-solution'

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
    private readonly paymentSolution: IPaymentSolution,
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
    const products = this.transformOrderItemsToProducts(orderItems)
    const allProductsAmount = products.reduce(
      (total, currentItem) => total + currentItem.getPrice(),
      0,
    )
    if (allProductsAmount !== orderAmount) {
      throw new DomainException(
        'O valor total deve ser válido',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    if (!(payment.type in PaymentType)) {
      throw new DomainException(
        'Informe uma opção de pagamento válida',
        ExceptionCause.INVALID_DATA,
      )
    }
    if (payment.type !== PaymentType.PIX) {
      throw new DomainException(
        'Opção não implementada',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    const currentDate = formatDateWithTimezone(new Date())
    const orderPaymentId = randomUUID()
    const mountedPayment = this.mountExternalPayment(
      orderAmount,
      orderItems,
      payment,
      orderPaymentId,
      customer,
    )
    const externalPayment =
      await this.paymentSolution.createPayment(mountedPayment)
    if (!externalPayment) {
      throw new DomainException(
        'Não foi possível processar o pedido',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    const orderPayment = new Payment(
      payment.type,
      PaymentCurrentStatus.PENDENTE,
      currentDate,
      orderPaymentId,
      externalPayment.id.toString(),
      currentDate,
      currentDate,
    )
    await this.paymentRepository.savePayment(orderPayment)
    const order = new Order(
      orderAmount,
      OrderCurrentStatus.RECEBIDO,
      products,
      orderPayment,
      customer,
      null,
      currentDate,
      currentDate,
    )
    const orderId = await this.orderRepository.saveOrder(order)
    for (const item of orderItems) {
      await this.orderRepository.saveOrderProduct({
        orderId,
        productId: item.product.getId(),
        quantity: item.quantity,
        price: item.product.getPrice(),
        observation: item.observation,
        effectiveDate: currentDate,
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
        qrCode: externalPayment.point_of_interaction.transaction_data.qr_code,
        ticketUrl:
          externalPayment.point_of_interaction.transaction_data.ticket_url,
        expirationDate: mountedPayment.date_of_expiration,
      },
      customer: serializedCustomer
        ? {
            id: serializedCustomer.id,
            document: serializedCustomer.document,
            name: serializedCustomer.name,
            email: serializedCustomer.email,
          }
        : undefined,
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

  private mountExternalPayment(
    orderAmount: number,
    items: OrderItem[],
    payment: MakeCheckoutInput['payment'],
    orderPaymentId: string,
    customer?: Customer,
  ): PaymentInput {
    return {
      transaction_amount: orderAmount,
      description: `Pagamento ${orderPaymentId}`,
      installments: 1,
      notification_url: globalEnvs.paymentSolution.webhookUrl,
      payment_method_id: payment.type.toLowerCase(),
      date_of_expiration: increaseTimeToDate(30),
      additional_info: {
        items: items.map(item => ({
          id: item.product.getId().toString(),
          quantity: item.quantity,
          description: item.observation,
          title: item.product.getName(),
          unit_price: item.product.getPrice(),
          picture_url: item.product.getImageLinks()[0] || '',
          category_id: item.product.getCategory(),
        })),
        payer: customer
          ? {
              first_name: customer.getName(),
            }
          : undefined,
      },
      payer: customer
        ? {
            email: customer.getEmail(),
            entity_type: 'individual',
            type: 'customer',
            identification: {
              type: 'CPF',
              number: customer.getDocument(),
            },
          }
        : undefined,
    }
  }
}
