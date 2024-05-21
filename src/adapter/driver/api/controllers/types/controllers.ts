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

export interface IProductController {
  createProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  updateProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  searchProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  removeProduct(
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
