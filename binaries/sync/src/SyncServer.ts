import { Express } from 'express'
import { CommandQueue } from '@sosus/core-queue'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server, LoggerMiddleware } from '@sosus/core-web'

import { SyncServerConfig, SyncServerConfigType } from './SyncServerConfig'

@injectable()
@singleton()
export class SyncServer extends Server<SyncServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(SyncServerConfigType) config: SyncServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    // tslint:disable-next-line:variable-name
    private readonly command_queue: CommandQueue,
  ) {
    super('sync-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())
  }
}
