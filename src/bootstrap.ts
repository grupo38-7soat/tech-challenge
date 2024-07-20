import {
  CreateCustomerUseCase,
  CreateProductUseCase,
  GetCustomerByDocumentUseCase,
  GetOrderPaymentUseCase,
  MakeCheckoutUseCase,
  RemoveProductUseCase,
  SearchOrdersUseCase,
  SearchProductsUseCase,
  UpdateProductUseCase,
} from '@core/application/use-cases'
import { globalEnvs } from '@adapter/config/envs/global'
import {
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

const postgresConnectionAdapter = new PostgresConnectionAdapter()
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
)
const searchOrdersUseCase = new SearchOrdersUseCase(orderRepository)
const getOrderPaymentUseCase = new GetOrderPaymentUseCase(paymentRepository)
// controllers
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
  getOrderPaymentUseCase,
)
const server: IHttpServer = new ExpressHttpServerAdapter(
  customerController,
  productController,
  orderController,
)
server.run(globalEnvs.api.serverPort)
