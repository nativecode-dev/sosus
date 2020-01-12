import * as sapper from '@sapper/server'

import { Express } from 'express'
import { RouterType, Server, LoggerMiddleware, ServerConfigurationType } from '@sosus/core-web'
import { ProcessConfig, ProcessConfigType } from '@sosus/core-process'
import { inject, injectable, singleton, LoggerType, Lincoln, DependencyContainer } from '@sosus/core'

import { SapperServerConfig } from './SapperServerConfig'

@injectable()
@singleton()
export class SapperServer extends Server<SapperServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ServerConfigurationType) config: SapperServerConfig,
  ) {
    super('sapper-server', express, logger, config)
    this.log.debug('created', this.name)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    express.use(sapper.middleware())
  }

  protected async configurations(container: DependencyContainer, config: SapperServerConfig) {
    container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
  }
}
