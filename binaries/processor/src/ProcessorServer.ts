import { Express } from 'express'
import { CommandHandler } from '@sosus/core-queue'
import { inject, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { RouterType, Server, LoggerMiddleware, ServerConfigurationType } from '@sosus/core-web'

import { ProcessorServerConfig } from './ProcessorServerConfig'

@injectable()
@singleton()
export class ProcessorServer extends Server<ProcessorServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ServerConfigurationType) config: ProcessorServerConfig,
    protected readonly commands: CommandHandler,
  ) {
    super('processor-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
  }
}
