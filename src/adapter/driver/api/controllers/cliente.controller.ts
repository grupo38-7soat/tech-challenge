import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { IClienteController } from './types/controllers'

export class ClienteController implements IClienteController {
  constructor() {}

  async criarCliente(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Criando cliente...' })
  }

  async consultarClientePeloCpf(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Pesquisando cliente...' })
  }
}
