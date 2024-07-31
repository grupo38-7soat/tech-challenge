import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { globalEnvs } from '@config/envs/global'
import { IHealthController } from './types/controllers'
import { HttpResponseHelper } from '../helpers'
import { HttpStatus } from '../types/http-server'

export class HealthController implements IHealthController {
  constructor() {}

  async check(
    _request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      return HttpResponseHelper.onSucess(response, {
        data: {
          status: 'HEALTH',
          stage: globalEnvs.api.stage.toUpperCase(),
        },
        statusCode: HttpStatus.OK,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
