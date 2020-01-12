import { Express } from 'express'
import { inject, injectAll, injectable, singleton } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server } from '@sosus/core-web'

import { SyncServerConfig, SyncServerConfigType } from './SyncServerConfig'

@injectable()
@singleton()
export class SyncServer extends Server<SyncServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(SyncServerConfigType) config: SyncServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
  ) {
    super(express, config)
  }

  protected async bootstrap(express: Express) {
    this.routes.map(route => route.register())
  }
}
