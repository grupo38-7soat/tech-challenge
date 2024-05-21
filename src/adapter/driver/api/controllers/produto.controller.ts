import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { IProdutoController } from './types/controllers'

export class ProdutoController implements IProdutoController {
  constructor() {}

  async criarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Criando produto...' })
  }

  async atualizarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Atualizando produto...' })
  }

  async consultarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Pesquisando produtos...' })
  }

  async removerProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    console.log('Rota: ', {
      url: request.url,
      method: request.method,
      body: request.body,
      params: request.params,
    })
    return response.json({ message: 'Removendo produto...' })
  }
}
