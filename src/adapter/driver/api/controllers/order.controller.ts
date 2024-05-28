import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import {
  IMakeCheckoutUseCase,
  SearchOrdersUseCase,
} from '@core/application/use-cases'
import { IOrderController } from './types/controllers'
import { HttpResponseHelper } from '../helpers'
import { OrderCurrentStatus } from '@core/domain/entities'

export class OrderController implements IOrderController {
  constructor(
    private readonly makeCheckoutUseCase: IMakeCheckoutUseCase,
    private readonly searchOrdersUseCase: SearchOrdersUseCase,
  ) {}

  async makeCheckout(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const orderData = await this.makeCheckoutUseCase.execute({
        customerId: request.body.customerId,
        items: request.body.items,
        orderAmount: request.body.orderAmount,
        payment: request.body.payment,
      })
      return HttpResponseHelper.onSucess(response, { data: orderData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async searchOrders(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      console.log('Rota: ', {
        url: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
      })
      const orderData = await this.searchOrdersUseCase.execute({
        id: request.query.id ? Number(request.query.id) : undefined,
        status: request.query.status as OrderCurrentStatus,
      })
      return HttpResponseHelper.onSucess(response, { data: orderData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
