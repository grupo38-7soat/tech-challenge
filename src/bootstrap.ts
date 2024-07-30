import { globalEnvs } from '@config/envs/global'
import {
  CreateCustomerUseCase,
  CreateProductUseCase,
  GetCustomerByDocumentUseCase,
  GetOrderPaymentUseCase,
  ListenOrderPaymentUseCase,
  MakeCheckoutUseCase,
  RemoveProductUseCase,
  SearchOrdersUseCase,
  SearchProductsUseCase,
  UpdateOrderStatusUseCase,
  UpdateProductUseCase,
} from '@core/application/use-cases'
import {
  HealthController,
  CustomerController,
  OrderController,
  ProductController,
} from '@adapter/driver/api/controllers'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'
import { PostgresConnectionAdapter } from '@adapter/driven/database/postgres-connection.adapter'
import { CustomerRepository } from '@adapter/driven/database/repositories'
import { ProductRepository } from '@adapter/driven/database/repositories/product.repository'
import { PaymentRepository } from '@adapter/driven/database/repositories/payment.repository'
import { OrderRepository } from '@adapter/driven/database/repositories/order.repository'
import { MercadoPagoAdapter } from '@adapter/driven/payment-solution/mercado-pago.adapter'
import { HttpClientAdapter } from '@adapter/driven/http/http-client.adapter'

const postgresConnectionAdapter = new PostgresConnectionAdapter()
const httpClientAdapter = new HttpClientAdapter(
  globalEnvs.paymentSolution.baseUrl,
)
const paymentSolution = new MercadoPagoAdapter(httpClientAdapter)
// repositories
const customerRepository = new CustomerRepository(postgresConnectionAdapter)
const productRepository = new ProductRepository(postgresConnectionAdapter)
const paymentRepository = new PaymentRepository(postgresConnectionAdapter)
const orderRepository = new OrderRepository(postgresConnectionAdapter)
// useCases
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)
const getCustomerByDocumentUseCase = new GetCustomerByDocumentUseCase(
  customerRepository,
)
const createProductUseCase = new CreateProductUseCase(productRepository)
const updateProductUseCase = new UpdateProductUseCase(productRepository)
const searchProductsUseCase = new SearchProductsUseCase(productRepository)
const removeProductUseCase = new RemoveProductUseCase(productRepository)
const makeCheckoutUseCase = new MakeCheckoutUseCase(
  customerRepository,
  productRepository,
  paymentRepository,
  orderRepository,
  paymentSolution,
)
const searchOrdersUseCase = new SearchOrdersUseCase(orderRepository)
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository)
const getOrderPaymentUseCase = new GetOrderPaymentUseCase(paymentRepository)
const listenOrderPaymentUseCase = new ListenOrderPaymentUseCase(
  orderRepository,
  paymentRepository,
  paymentSolution,
)
// controllers
const healthController = new HealthController(postgresConnectionAdapter)
const customerController = new CustomerController(
  createCustomerUseCase,
  getCustomerByDocumentUseCase,
)
const productController = new ProductController(
  createProductUseCase,
  updateProductUseCase,
  searchProductsUseCase,
  removeProductUseCase,
)
const orderController = new OrderController(
  makeCheckoutUseCase,
  searchOrdersUseCase,
  updateOrderStatusUseCase,
  getOrderPaymentUseCase,
  listenOrderPaymentUseCase,
)
const server: IHttpServer = new ExpressHttpServerAdapter(
  healthController,
  customerController,
  productController,
  orderController,
)
server.run(globalEnvs.api.serverPort)
