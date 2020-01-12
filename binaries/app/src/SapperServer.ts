import * as sapper from '@sapper/server'

import { Express } from 'express'
import { RouterType, Server, LoggerMiddleware } from '@sosus/core-web'
import { inject, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'

import { SapperServerConfig, SapperServerConfigType } from './SapperServerConfig'

@injectable()
@singleton()
export class SapperServer extends Server<SapperServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(SapperServerConfigType) config: SapperServerConfig,
  ) {
    super('sapper-server', express, logger, config)
    this.log.debug('created', this.name)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    express.use(sapper.middleware())
  }
}
