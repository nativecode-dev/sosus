import express from 'express'

import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { container, fs, DeepPartial, DefaultConfig, SosusConfig, CouchConfig } from '@sosus/core'
import { Bootstrap, ServerConfigDefaults, RouteCollectionType, RouterType, IRoute } from '@sosus/core-web'

import { Movies } from './routes/Movies'
import { Default } from './routes/Default'
import { ApiServer } from './ApiServer'
import { ApiServerConfig, ApiServerConfigType } from './ApiServerConfig'

const DefaultApiServerConfig: DeepPartial<ApiServerConfig> = {
  ...DefaultConfig,
  ...ServerConfigDefaults,
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  port: 9000,
}

export default async function() {
  const loader = new SosusConfig<ApiServerConfig>('.sosus-api.json', DefaultApiServerConfig)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()
  await fs.mkdirp(config.root)

  console.log('registering dependencies')

  container.register<ApiServerConfig>(ApiServerConfigType, { useValue: config })
  container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })
  container.register<express.Express>(RouterType, { useValue: express() })

  container.register<IRoute>(RouteCollectionType, Default)
  container.register<IRoute>(RouteCollectionType, Movies)

  console.log('resolving server')
  const server = container.resolve(ApiServer)
  await Bootstrap(server, config)
}
