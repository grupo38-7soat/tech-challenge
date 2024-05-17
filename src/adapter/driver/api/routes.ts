import { IRouteProps } from './types/http-server'

export const serverRoutes: IRouteProps[] = [
  {
    resource: '',
    method: 'get',
    middleware: (_request, _response, next) => next(),
    handler: (request, response) => {
      console.log('Rota: ', {
        url: request.url,
        method: request.method,
        body: request.body,
      })
      response.send('OK')
    },
  },
]
