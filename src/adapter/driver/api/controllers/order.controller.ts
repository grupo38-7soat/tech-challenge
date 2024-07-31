import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import {
  IGetOrderPaymentUseCase,
  IListenOrderPaymentUseCase,
  IMakeCheckoutUseCase,
  ISearchOrdersUseCase,
  IUpdateOrderStatusUseCase,
} from '@core/application/use-cases'
import { IOrderController } from './types/controllers'
import { HttpResponseHelper } from '../helpers'
import { OrderCurrentStatus } from '@core/domain/entities'

export class OrderController implements IOrderController {
  constructor(
    private readonly makeCheckoutUseCase: IMakeCheckoutUseCase,
    private readonly searchOrdersUseCase: ISearchOrdersUseCase,
    private readonly updateOrderStatusUseCase: IUpdateOrderStatusUseCase,
    private readonly getOrderPaymentUseCase: IGetOrderPaymentUseCase,
    private readonly listenOrderPaymentUseCase: IListenOrderPaymentUseCase,
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
      const orderData = await this.searchOrdersUseCase.execute({
        id: request.query.id ? Number(request.query.id) : undefined,
        status: request.query.status as OrderCurrentStatus,
      })
      return HttpResponseHelper.onSucess(response, { data: orderData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async updateOrderStatus(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const orderId = request.params.id
      const status = request.body?.status || ''
      const updatedOrderData = await this.updateOrderStatusUseCase.execute({
        orderId: Number(orderId),
        status,
      })
      return HttpResponseHelper.onSucess(response, { data: updatedOrderData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async getOrderPayment(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const orderId = request.params.id
      const orderPaymentData = await this.getOrderPaymentUseCase.execute({
        orderId: Number(orderId),
      })
      return HttpResponseHelper.onSucess(response, { data: orderPaymentData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async listenOrderPayment(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const { action, data } = request.body
      await this.listenOrderPaymentUseCase.execute({
        action,
        externalPaymentId: data?.id,
      })
      return HttpResponseHelper.onSucess(response, { data: 'OK' })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
