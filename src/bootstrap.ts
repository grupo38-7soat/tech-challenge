import { globalEnvs } from '@adapter/config/envs/global'
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
import {
  CustomerController,
  OrderController,
  ProductController,
} from '@adapter/driver/api/controllers'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'

// useCases
const createCustomerUseCase = new CreateCustomerUseCase()
const getCustomerByDocumentUseCase = new GetCustomerByDocumentUseCase()
const createProductUseCase = new CreateProductUseCase()
const updateProductUseCase = new UpdateProductUseCase()
const searchProductUseCase = new SearchProductUseCase()
const removeProductUseCase = new RemoveProductUseCase()
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
server.run(globalEnvs.serverPort)
