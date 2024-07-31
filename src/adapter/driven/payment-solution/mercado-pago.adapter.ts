import { randomUUID } from 'crypto'
import { globalEnvs } from '@config/envs/global'
import {
  IPaymentSolution,
  PaymentInput,
  PaymentOutput,
} from '@core/application/use-cases'
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
      console.log('[MercadoPagoAdapter] Pagamento não pode ser criado')
      return null
    }
    console.log('[MercadoPagoAdapter] Pagamento criado com sucesso')
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
    console.log('[MercadoPagoAdapter] Pagamento encontrado com sucesso')
    return data
  }
}
