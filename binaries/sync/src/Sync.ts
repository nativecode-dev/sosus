import { CouchConfig } from '@sosus/core-data'
import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { ProcessConfig, ProcessConfigType } from '@sosus/core-process'
import { WebApplication, IRoute, RouteCollectionType, Commands } from '@sosus/core-web'
import { Configuration, DependencyContainer, RedisConfig, RedisConfigType } from '@sosus/core'

import { SyncServer } from './SyncServer'
import { SyncServerConfig } from './SyncServerConfig'

export class Sync extends WebApplication<SyncServerConfig> {
  constructor(configuration: Configuration<SyncServerConfig>) {
    super('', configuration, SyncServer)
  }

  protected dependencies(container: DependencyContainer, config: SyncServerConfig): void {
    container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
    container.register<RedisConfig>(RedisConfigType, { useValue: config.redis })
    container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
    container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
    container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })

    container.register<IRoute>(RouteCollectionType, Commands)
  }
}
