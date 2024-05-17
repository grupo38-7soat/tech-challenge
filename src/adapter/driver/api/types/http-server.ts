export type IHttpRequest = {
  params?: { [key: string]: string }
  query?: { [key: string]: string }
  body?: { [key: string]: unknown }
}

export type IHttpResponse<T> = {
  data?: T
  error?: {
    code: string
    message: string
    description: string
  }
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type IRouteProps = {
  resource: string
  method: string
  middleware: Function
  handler: Function
}

export interface IHttpServer {
  run(port: number): void
}
