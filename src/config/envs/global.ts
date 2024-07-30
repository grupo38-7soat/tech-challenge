import dotenv from 'dotenv'

dotenv.config({
  path: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
})

const apiEnvs = {
  serverPort: Number(process.env.SERVER_PORT) || 3000,
  stage: process.env.NODE_ENV,
}

const databaseEnvs = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}

const paymentSolutionEnvs = {
  baseUrl: process.env.MERCADO_PAGO_BASE_URL,
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  webhookUrl: process.env.LISTEN_ORDER_PAYMENT_URL,
}

export const globalEnvs = {
  api: {
    ...apiEnvs,
  },
  database: {
    ...databaseEnvs,
  },
  paymentSolution: {
    ...paymentSolutionEnvs,
  },
}
