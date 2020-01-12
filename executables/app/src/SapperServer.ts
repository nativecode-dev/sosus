import * as sapper from '@sapper/server'

import { Express } from 'express'
import { inject, injectAll, injectable, singleton, Logger } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server } from '@sosus/core-web'

import { SapperServerConfig, SapperServerConfigType } from './SapperServerConfig'

@injectable()
@singleton()
export class SapperServer extends Server<SapperServerConfig> {
  readonly name = 'api-server'

  private readonly log = Logger.extend(this.name)

  constructor(
    @inject(RouterType) express: Express,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    @inject(SapperServerConfigType) config: SapperServerConfig,
  ) {
    super(express, config)
    this.log.debug('created', this.name)
  }

  protected async bootstrap(express: Express) {
    express.use(sapper.middleware())
    this.routes.map(route => route.register())
  }
}
