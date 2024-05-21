import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import {
  ICreateCustomerUseCase,
  IGetCustomerByDocumentUseCase,
} from '@core/application/use-cases'
import { ICustomerController } from './types/controllers'
import { HttpStatus } from '../types/http-server'
import { HttpResponseHelper } from '../helpers'

export class CustomerController implements ICustomerController {
  constructor(
    private readonly createCustomerUseCase: ICreateCustomerUseCase,
    private readonly getCustomerByDocumentUseCase: IGetCustomerByDocumentUseCase,
  ) {}

  async createCustomer(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const customerData = await this.createCustomerUseCase.execute({
        document: request.body.document,
        email: request.body.email,
        name: request.body.name,
      })
      return HttpResponseHelper.onSucess(response, {
        data: customerData,
        statusCode: HttpStatus.CREATED,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async getCustomerByDocument(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const customerData = await this.getCustomerByDocumentUseCase.execute({
        document: request.params.document,
      })
      return HttpResponseHelper.onSucess(response, {
        data: customerData,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
