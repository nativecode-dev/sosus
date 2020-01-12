import { Express } from 'express'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server, LoggerMiddleware } from '@sosus/core-web'

import { ProcessorServerConfig, ProcessorServerConfigType } from './ProcessorServerConfig'
import { CommandQueueHandler } from '@sosus/core-queue'

@injectable()
@singleton()
export class ProcessorServer extends Server<ProcessorServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ProcessorServerConfigType) config: ProcessorServerConfig,
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    private readonly commands: CommandQueueHandler,
  ) {
    super('sync-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())

    this.commands.start()
  }
}
