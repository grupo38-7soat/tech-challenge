import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFuction,
} from 'express'
import { IRouteProps } from './types/http-server'

export const customerRoutes: IRouteProps[] = [
  {
    resource: '/clientes',
    method: 'post',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'criarCliente',
  },
  {
    resource: '/clientes/:cpf',
    method: 'get',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'consultarClientePeloCpf',
  },
]

export const productRoutes: IRouteProps[] = [
  {
    resource: '/produtos',
    method: 'post',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'criarProduto',
  },
  {
    resource: '/produtos/:id',
    method: 'put',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'atualizarProduto',
  },
  {
    resource: '/produtos',
    method: 'get',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'consultarProduto',
  },
  {
    resource: '/produtos/:id',
    method: 'delete',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'removerProduto',
  },
]

export const orderRoutes: IRouteProps[] = [
  {
    resource: '/checkout',
    method: 'post',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'finalizarPedido',
  },
  {
    resource: '/pedidos',
    method: 'get',
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'consultarPedido',
  },
]
