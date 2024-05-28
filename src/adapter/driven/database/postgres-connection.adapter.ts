import { globalEnvs } from '@adapter/config/envs/global'
import { Client, QueryResult } from 'pg'

export class PostgresConnectionAdapter {
  private client: Client

  constructor() {
    this.client = null
  }

  private async connect(): Promise<void> {
    if (!this.client) {
      this.client = new Client({
        host: globalEnvs.database.host,
        port: globalEnvs.database.port,
        database: globalEnvs.database.name,
        user: globalEnvs.database.user,
        password: globalEnvs.database.password,
      })
      await this.client.connect()
    }
  }

  private async destroy(): Promise<void> {
    if (this.client) {
      await this.client.end()
      this.client = null
    }
  }

  async query<T>(sqlQuery: string, params: unknown[]): Promise<QueryResult<T>> {
    await this.connect()
    console.log(`[Database] ${sqlQuery}`)
    const result = await this.client.query(sqlQuery, params)
    await this.destroy()
    return result
  }
}
