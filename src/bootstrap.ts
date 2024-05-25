import {
  CreateCustomerUseCase,
  CreateProductUseCase,
  GetCustomerByDocumentUseCase,
  MakeCheckoutUseCase,
  RemoveProductUseCase,
  SearchOrdersUseCase,
  SearchProductUseCase,
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

const postgresConnectionAdapter = new PostgresConnectionAdapter()
// repositories
const customerRepository = new CustomerRepository(postgresConnectionAdapter)
const productRepository = new ProductRepository(postgresConnectionAdapter)
// useCases
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)
const getCustomerByDocumentUseCase = new GetCustomerByDocumentUseCase(
  customerRepository,
)
const createProductUseCase = new CreateProductUseCase(productRepository)
const updateProductUseCase = new UpdateProductUseCase(productRepository)
const searchProductUseCase = new SearchProductUseCase()
const removeProductUseCase = new RemoveProductUseCase(productRepository)
const makeCheckoutUseCase = new MakeCheckoutUseCase()
const searchOrdersUseCase = new SearchOrdersUseCase()
// controllers
const customerController = new CustomerController(
  createCustomerUseCase,
  getCustomerByDocumentUseCase,
)
const productController = new ProductController(
  createProductUseCase,
  updateProductUseCase,
  searchProductUseCase,
  removeProductUseCase,
)
const orderController = new OrderController(
  makeCheckoutUseCase,
  searchOrdersUseCase,
)
const server: IHttpServer = new ExpressHttpServerAdapter(
  customerController,
  productController,
  orderController,
)
server.run(globalEnvs.api.serverPort)
