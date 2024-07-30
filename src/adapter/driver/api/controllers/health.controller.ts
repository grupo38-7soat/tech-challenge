import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { globalEnvs } from '@config/envs/global'
import { PostgresConnectionAdapter } from '@adapter/driven/database/postgres-connection.adapter'
import { IHealthController } from './types/controllers'
import { HttpResponseHelper } from '../helpers'
import { HttpStatus } from '../types/http-server'

export class HealthController implements IHealthController {
  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {}

  async check(
    _request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const databaseIsRunning =
        await this.postgresConnectionAdapter.checkDatabase()
      return HttpResponseHelper.onSucess(response, {
        data: {
          status: `${!databaseIsRunning ? 'UN' : ''}HEALTH`,
          stage: globalEnvs.api.stage.toUpperCase(),
          info: {
            database: {
              status: databaseIsRunning ? 'UP' : 'DOWN',
            },
          },
        },
        statusCode: databaseIsRunning
          ? HttpStatus.OK
          : HttpStatus.INTERNAL_SERVER_ERROR,
      })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
