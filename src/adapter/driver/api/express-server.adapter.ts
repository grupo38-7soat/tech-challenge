import express, { Express, Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerSpecs from 'src/adapter/driver/api/config/swagger/swagger.config'
import { IHttpServer } from './types/http-server'
import { serverRoutes } from './routes'

export class ExpressHttpServerAdapter implements IHttpServer {
  app: Express
  router: Router

  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.router = express.Router()
    this.configRoutes()
    this.configDocumentation()
  }

  private configRoutes(): void {
    serverRoutes.forEach(route => {
      this.router[route.method](route.resource, route.middleware, route.handler)
    })
    this.app.use(this.router)
  }

  private configDocumentation(): void {
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))
  }

  run(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}
