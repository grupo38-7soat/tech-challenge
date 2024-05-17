import dotenv from 'dotenv'

dotenv.config({
  path: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
})

const apiEnvs = {
  serverPort: Number(process.env.SERVER_PORT) || 3000,
}

export const globalEnvs = {
  ...apiEnvs,
}
