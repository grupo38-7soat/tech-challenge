import { globalEnvs } from '@adapter/config/envs/global'
import {
  CreateCustomerUseCase,
  GetCustomerByDocumentUseCase,
} from '@core/application/use-cases'
import {
  CustomerController,
  PedidoController,
  ProdutoController,
} from '@adapter/driver/api/controllers'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'

// useCases
const createCustomerUseCase = new CreateCustomerUseCase()
const getCustomerByDocumentUseCase = new GetCustomerByDocumentUseCase()
// controllers
const customerController = new CustomerController(
  createCustomerUseCase,
  getCustomerByDocumentUseCase,
)
const produtoController = new ProdutoController()
const pedidoController = new PedidoController()
const server: IHttpServer = new ExpressHttpServerAdapter(
  customerController,
  produtoController,
  pedidoController,
)
server.run(globalEnvs.serverPort)
