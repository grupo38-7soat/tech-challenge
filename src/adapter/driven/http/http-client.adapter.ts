import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

export type HttpResponse<T> = Omit<
  AxiosResponse<T>,
  'headers' | 'config' | 'request'
>

export type HttpRequest = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  config?: AxiosRequestConfig
}

export class HttpClientAdapter {
  private instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    })
    this.instance.interceptors.response.use(null, (error: AxiosError) => {
      const { data, status, statusText } = error.response
      return {
        data,
        status,
        statusText,
      }
    })
  }

  async makeRequest<T>({
    url,
    method,
    data,
    config,
  }: HttpRequest): Promise<HttpResponse<T>> {
    const {
      data: responseData,
      status,
      statusText,
    } = await this.instance<T>({
      url,
      method,
      data,
      ...config,
    })
    return {
      data: responseData,
      status,
      statusText,
    }
  }
}
