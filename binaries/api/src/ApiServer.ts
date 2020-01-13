import { Express } from 'express'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'

import {
  IRoute,
  RouteCollectionType,
  RouterType,
  Server,
  LoggerMiddleware,
  ServerConfigurationType,
} from '@sosus/core-web'

import { ApiServerConfig } from './ApiServerConfig'

@injectable()
@singleton()
export class ApiServer extends Server<ApiServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(ServerConfigurationType) config: ApiServerConfig,
    @inject(LoggerType) logger: Lincoln,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
  ) {
    super('api-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())
  }
}
