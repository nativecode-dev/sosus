import { Express } from 'express'
import { IRoute, RouteCollectionType, RouterType, Server, LoggerMiddleware } from '@sosus/core-web'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'

import { SyncServerConfig, SyncServerConfigType } from './SyncServerConfig'

@injectable()
@singleton()
export class SyncServer extends Server<SyncServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(SyncServerConfigType) config: SyncServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
  ) {
    super('sync-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())
  }
}
