import express from 'express'

import { CouchConfig } from '@sosus/core-data'
import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { ProcessConfig, ProcessConfigType, registerCommands } from '@sosus/core-process'
import { WebApplication, IRoute, RouteCollectionType, Commands } from '@sosus/core-web'
import { Configuration, DependencyContainer, RedisConfig, RedisConfigType } from '@sosus/core'

import { ProcessorServer } from './ProcessorServer'
import { ProcessorServerConfig } from './ProcessorServerConfig'

export class Processor extends WebApplication<ProcessorServerConfig> {
  constructor(configuration: Configuration<ProcessorServerConfig>) {
    super('', configuration, ProcessorServer)
  }

  protected bootstrap(express: express.Express): Promise<void> {
    return Promise.resolve()
  }

  protected dependencies(container: DependencyContainer, config: ProcessorServerConfig): void {
    container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
    container.register<RedisConfig>(RedisConfigType, { useValue: config.redis })
    container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
    container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
    container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })

    container.register<IRoute>(RouteCollectionType, Commands)

    registerCommands(container)
  }
}
