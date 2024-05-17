import { globalEnvs } from '@adapter/config/envs/global'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'

const server: IHttpServer = new ExpressHttpServerAdapter()
server.run(globalEnvs.serverPort)
