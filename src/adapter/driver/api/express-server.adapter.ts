import express, { Express, Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerSpecs from '@adapter/driver/api/config/swagger/swagger.config'
import { IHttpServer } from './types/http-server'
import {
  ICustomerController,
  IProdutoController,
  IPedidoController,
} from './controllers/types/controllers'
import { customerRoutes, productRoutes, orderRoutes } from './routes'

export class ExpressHttpServerAdapter implements IHttpServer {
  app: Express
  router: Router

  constructor(
    private readonly customerController: ICustomerController,
    private readonly produtoController: IProdutoController,
    private readonly pedidoController: IPedidoController,
  ) {
    this.app = express()
    this.app.use(express.json())
    this.router = express.Router()
    this.configRoutes()
    this.configDocumentation()
  }

  private configRoutes(): void {
    this.configCustomerRoutes()
    this.configProductRoutes()
    this.configOrderRoutes()
    this.app.use(this.router)
  }

  private configCustomerRoutes(): void {
    customerRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.customerController[route.handler].bind(this.customerController),
      )
    })
  }

  private configProductRoutes(): void {
    productRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.produtoController[route.handler].bind(this.produtoController),
      )
    })
  }

  private configOrderRoutes(): void {
    orderRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.pedidoController[route.handler].bind(this.pedidoController),
      )
    })
  }

  private configDocumentation(): void {
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))
  }

  run(port: number): void {
    this.app.listen(port, () => {
      console.log(`[HttpServer] Servidor rodando na porta ${port}`)
    })
  }
}
