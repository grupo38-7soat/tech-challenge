export type IHttpRequest = {
  params?: { [key: string]: string }
  query?: { [key: string]: string }
  body?: { [key: string]: unknown }
}

export type IHttpResponse = {
  statusCode?: number
  data?: unknown
  error?: {
    message: string
    cause?: string
  }
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export type IRouteProps = {
  resource: string
  method: string
  middleware: Function
  handler: string
}

export interface IHttpServer {
  run(port: number): void
}
