import { Express } from 'express'
import { CommandHandler } from '@sosus/core-queue'
import { inject, injectable, singleton, LoggerType, Lincoln, injectAll } from '@sosus/core'

import {
  RouterType,
  Server,
  LoggerMiddleware,
  ServerConfigurationType,
  IRoute,
  RouteCollectionType,
} from '@sosus/core-web'

import { ProcessorServerConfig } from './ProcessorServerConfig'

@injectable()
@singleton()
export class ProcessorServer extends Server<ProcessorServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ServerConfigurationType) config: ProcessorServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    commands: CommandHandler,
  ) {
    super('processor-server', express, logger, config)
    this.log.debug(this.name, commands.name)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())
  }
}
