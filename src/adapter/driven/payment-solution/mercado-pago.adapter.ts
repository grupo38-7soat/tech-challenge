import { randomUUID } from 'crypto'
import {
  IPaymentSolution,
  PaymentInput,
  PaymentOutput,
} from '@core/application/use-cases'
import { globalEnvs } from '@adapter/config/envs/global'
import { HttpClientAdapter } from '../http/http-client.adapter'
import { HttpStatus } from '@adapter/driver/api/types/http-server'

export class MercadoPagoAdapter implements IPaymentSolution {
  constructor(private readonly httpClientAdapter: HttpClientAdapter) {}

  async createPayment(input: PaymentInput): Promise<PaymentOutput> {
    const resource = 'v1/payments'
    const { data, status } =
      await this.httpClientAdapter.makeRequest<PaymentOutput>({
        url: `${globalEnvs.paymentSolution.baseUrl}/${resource}`,
        method: 'POST',
        data: input,
        config: {
          headers: {
            Authorization: `Bearer ${globalEnvs.paymentSolution.accessToken}`,
            'X-Idempotency-Key': randomUUID(),
          },
        },
      })
    if (status !== HttpStatus.CREATED) {
      return null
    }
    return data
  }

  async findPayment(paymentId: number): Promise<PaymentOutput> {
    const resource = 'v1/payments'
    const { data } = await this.httpClientAdapter.makeRequest<PaymentOutput>({
      url: `${globalEnvs.paymentSolution.baseUrl}/${resource}/${paymentId}`,
      method: 'GET',
      config: {
        headers: {
          Authorization: `Bearer ${globalEnvs.paymentSolution.accessToken}`,
        },
      },
    })
    return data
  }
}
