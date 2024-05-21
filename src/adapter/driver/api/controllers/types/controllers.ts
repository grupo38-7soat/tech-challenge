import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface ICustomerController {
  createCustomer(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  getCustomerByDocument(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

export interface IProdutoController {
  criarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  atualizarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  consultarProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  removerProduto(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

export interface IPedidoController {
  finalizarPedido(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  consultarPedido(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}
