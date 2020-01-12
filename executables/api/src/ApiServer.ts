import { Express } from 'express'
import { inject, injectAll, injectable, singleton, Logger } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server } from '@sosus/core-web'

import { ApiServerConfig, ApiServerConfigType } from './ApiServerConfig'

@injectable()
@singleton()
export class ApiServer extends Server<ApiServerConfig> {
  readonly name = 'api-server'

  private readonly log = Logger.extend(this.name)

  constructor(
    @inject(RouterType) express: Express,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    @inject(ApiServerConfigType) config: ApiServerConfig,
  ) {
    super(express, config)
    this.log.debug('created', this.name)
  }

  protected async bootstrap(express: Express) {
    this.routes.map(route => route.register())

    console.log(Object.keys(express._router))
  }
}
