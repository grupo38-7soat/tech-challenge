import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import {
  ICreateProductUseCase,
  IRemoveProductUseCase,
  ISearchProductsUseCase,
  IUpdateProductUseCase,
} from '@core/application/use-cases'
import { IProductController } from './types/controllers'
import { HttpStatus } from '../types/http-server'
import { HttpResponseHelper } from '../helpers'

export class ProductController implements IProductController {
  constructor(
    private readonly createProductUseCase: ICreateProductUseCase,
    private readonly updateProductUseCase: IUpdateProductUseCase,
    private readonly searchProductsUseCase: ISearchProductsUseCase,
    private readonly removeProductUseCase: IRemoveProductUseCase,
  ) {}

  async createProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const productData = await this.createProductUseCase.execute({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        category: request.body.category,
        imageLinks: request.body.imageLinks,
      })
      return HttpResponseHelper.onSucess(response, {
        data: productData,
        statusCode: HttpStatus.CREATED,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async updateProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const productData = await this.updateProductUseCase.execute({
        id: parseInt(request.params.id),
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        category: request.body.category,
        imageLinks: request.body.imageLinks,
      })
      return HttpResponseHelper.onSucess(response, {
        data: productData,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async searchProducts(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const productsData = await this.searchProductsUseCase.execute({
        id: request.query.id ? Number(request.query.id) : undefined,
        name: request.query.name as string,
        category: request.query.category as string,
      })
      return HttpResponseHelper.onSucess(response, {
        data: productsData,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async removeProduct(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      await this.removeProductUseCase.execute({
        id: parseInt(request.params.id),
      })
      return HttpResponseHelper.onSucess(response, {
        statusCode: HttpStatus.NO_CONTENT,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
