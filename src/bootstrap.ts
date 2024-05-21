import { globalEnvs } from '@adapter/config/envs/global'
import {
  CreateCustomerUseCase,
  CreateProductUseCase,
  GetCustomerByDocumentUseCase,
  RemoveProductUseCase,
  SearchProductUseCase,
  UpdateProductUseCase,
} from '@core/application/use-cases'
import {
  CustomerController,
  PedidoController,
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
const pedidoController = new PedidoController()
const server: IHttpServer = new ExpressHttpServerAdapter(
  customerController,
  productController,
  pedidoController,
)
server.run(globalEnvs.serverPort)
