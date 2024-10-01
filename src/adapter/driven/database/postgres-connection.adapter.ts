import { globalEnvs } from '@config/envs/global'
import { Pool, QueryResult } from 'pg'

export class PostgresConnectionAdapter {
  private pool: Pool

  constructor() {
    this.pool = null
  }

  async query<T>(sqlQuery: string, params: unknown[]): Promise<QueryResult<T>> {
    await this.connect()
    console.log(`[Database] ${sqlQuery}`)
    const result = await this.pool.query(sqlQuery, params)
    return result
  }

  async checkDatabase(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1', [])
      if (result.rowCount === 1) {
        return true
      }
      return false
    } catch (error) {
      console.error(`[Database] ${error.message}`)
      return false
    }
  }

  private async connect(): Promise<void> {
    if (!this.pool) {
      console.log('[Database] Abrindo conexão com a base de dados')
      this.pool = new Pool({
        host: globalEnvs.database.host,
        port: globalEnvs.database.port,
        database: globalEnvs.database.name,
        user: globalEnvs.database.user,
        password: globalEnvs.database.password,
      })
      process.on('exit', () => {
        this.pool.end(() => {
          console.log('[Database] Fechando conexão com a base de dados')
        })
        this.pool = null
      })
    }
  }
}
