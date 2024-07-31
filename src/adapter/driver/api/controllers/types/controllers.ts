import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface IHealthController {
  check(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

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
  searchProducts(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  removeProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

export interface IOrderController {
  makeCheckout(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  searchOrders(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  updateOrderStatus(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  getOrderPayment(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  listenOrderPayment(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}
