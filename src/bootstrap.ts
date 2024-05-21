import { globalEnvs } from '@adapter/config/envs/global'
import {
  ClienteController,
  PedidoController,
  ProdutoController,
} from '@adapter/driver/api/controllers'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'

const clienteController = new ClienteController()
const produtoController = new ProdutoController()
const pedidoController = new PedidoController()
const server: IHttpServer = new ExpressHttpServerAdapter(
  clienteController,
  produtoController,
  pedidoController,
)
server.run(globalEnvs.serverPort)
