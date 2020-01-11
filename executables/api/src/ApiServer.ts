import { Express } from 'express'
import { Server } from '@sosus/core-web'

import { ApiServerConfig } from './ApiServerConfig'

export class ApiServer extends Server<ApiServerConfig> {
  constructor(config: ApiServerConfig) {
    super(config)
  }

  protected async bootstrap(express: Express) {
    express.use()
  }
}
