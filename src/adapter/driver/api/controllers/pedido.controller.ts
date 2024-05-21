import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { IPedidoController } from './types/controllers'

export class PedidoController implements IPedidoController {
  constructor() {}

  async finalizarPedido(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Criando pedido...' })
  }

  async consultarPedido(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Pesquisando pedido...' })
  }
}
