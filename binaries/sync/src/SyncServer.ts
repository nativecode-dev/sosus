import { Express } from 'express'
import { inject, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { RouterType, Server, LoggerMiddleware, ServerConfigurationType } from '@sosus/core-web'

import { SyncServerConfig } from './SyncServerConfig'

@injectable()
@singleton()
export class SyncServer extends Server<SyncServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ServerConfigurationType) config: SyncServerConfig,
  ) {
    super('sync-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
  }
}
