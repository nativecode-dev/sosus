import { Express } from 'express'
import { inject, injectAll, injectable, singleton, Logger, LoggerType, Lincoln } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server } from '@sosus/core-web'

import { ApiServerConfig, ApiServerConfigType } from './ApiServerConfig'

@injectable()
@singleton()
export class ApiServer extends Server<ApiServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(ApiServerConfigType) config: ApiServerConfig,
    @inject(LoggerType) logger: Lincoln,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
  ) {
    super('api-server', express, logger, config)
    this.log.debug('created', this.name)
  }

  protected async bootstrap(express: Express) {
    this.routes.map(route => route.register())
  }
}
