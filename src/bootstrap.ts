import express from 'express'

const SERVER_PORT = 3000
const app = express()
app.use(express.json())
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
