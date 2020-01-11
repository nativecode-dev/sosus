import { Express } from 'express'
import { Server } from '@sosus/core-web'
import { injectAll, container, injectable, singleton, inject } from '@sosus/core'

import { ApiServerConfig, ApiServerConfigType } from './ApiServerConfig'
import { IRoute, RouteCollectionType, RouterType } from './Route'

@injectable()
@singleton()
export class ApiServer extends Server<ApiServerConfig> {
  constructor(
    @inject(ApiServerConfigType) config: ApiServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
  ) {
    super(config)
  }

  protected async bootstrap(express: Express) {
    container.registerSingleton(RouterType, express.router)
    this.routes.map(route => Object.keys(route).map(key => console.log(key)))
  }
}
