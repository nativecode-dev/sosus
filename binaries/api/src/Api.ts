import { CouchConfig } from '@sosus/core-data'
import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system/'
import { ProcessConfig, ProcessConfigType, registerCommands } from '@sosus/core-process'
import { WebApplication, IRoute, RouteCollectionType, Commands } from '@sosus/core-web'
import { Configuration, DependencyContainer, RedisConfig, RedisConfigType } from '@sosus/core'

import { ApiServer } from './ApiServer'
import { ApiServerConfig } from './ApiServerConfig'

import { Default } from './routes/Default'
import { Movies } from './routes/Movies'
import { People } from './routes/People'
import { Series } from './routes/Series'

export class Api extends WebApplication<ApiServerConfig> {
  constructor(configuration: Configuration<ApiServerConfig>) {
    super('', configuration, ApiServer)
  }

  protected dependencies(container: DependencyContainer, config: ApiServerConfig): void {
    container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
    container.register<RedisConfig>(RedisConfigType, { useValue: config.redis })
    container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
    container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
    container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })

    container.register<IRoute>(RouteCollectionType, Commands)
    container.register<IRoute>(RouteCollectionType, Default)
    container.register<IRoute>(RouteCollectionType, Movies)
    container.register<IRoute>(RouteCollectionType, People)
    container.register<IRoute>(RouteCollectionType, Series)

    registerCommands(container)
  }
}
