import express from 'express'
import swaggerUI from 'swagger-ui-express'
import specs from './config/swagger/swagger.config'

const SERVER_PORT = 3000
const app = express()
app.use(express.json())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.get('', (request, response) => {
  console.log('Rota: ', {
    url: request.url,
    method: request.method,
    body: request.body,
  })
  response.send('OK')
})
app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`)
})
