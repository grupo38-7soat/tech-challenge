import { Response as ExpressResponse } from 'express'
import { HttpStatus, IHttpResponse } from '../types/http-server'
import { ExceptionCause } from '@core/domain/base'

export class HttpResponseHelper {
  static onSucess(
    response: ExpressResponse,
    { data, statusCode = HttpStatus.OK }: IHttpResponse,
  ): ExpressResponse {
    return response.status(statusCode).json({ data })
  }

  static onError(
    response: ExpressResponse,
    { error, statusCode }: IHttpResponse,
  ): ExpressResponse {
    const { message } = error
    const { cause = ExceptionCause.UNKNOWN_EXCEPTION } = error
    console.error(`[ERROR] ${cause}: ${message}`)
    return response.status(statusCode || this.parseExceptionCause(cause)).json({
      error: {
        message,
        cause,
      },
    })
  }

  private static parseExceptionCause(cause: string): number {
    const exceptionCauses = {
      [ExceptionCause.INVALID_DATA]: HttpStatus.BAD_REQUEST,
      [ExceptionCause.MISSING_DATA]: HttpStatus.BAD_REQUEST,
      [ExceptionCause.UNAUTHORIZED_ACCESS]: HttpStatus.UNAUTHORIZED,
      [ExceptionCause.FORBIDDEN_ACCESS]: HttpStatus.FORBIDDEN,
      [ExceptionCause.BUSINESS_EXCEPTION]: HttpStatus.BAD_REQUEST,
      [ExceptionCause.NOTFOUND_EXCEPTION]: HttpStatus.NOT_FOUND,
      [ExceptionCause.PERSISTANCE_EXCEPTION]: HttpStatus.INTERNAL_SERVER_ERROR,
      [ExceptionCause.UNKNOWN_EXCEPTION]: HttpStatus.INTERNAL_SERVER_ERROR,
    }
    return exceptionCauses[cause] || HttpStatus.INTERNAL_SERVER_ERROR
  }
}
