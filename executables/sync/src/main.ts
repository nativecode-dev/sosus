import express from 'express'

import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { Bootstrap, RouterType, RouteCollectionType, ServerConfigDefaults } from '@sosus/core-web'
import { container, fs, DeepPartial, DefaultConfig, SosusConfig } from '@sosus/core'

import { Default } from './routes/Default'
import { SyncApiServer } from './SyncServer'
import { SyncServerConfig, SyncServerConfigType } from './SyncServerConfig'

const DefaultApiServerConfig: DeepPartial<SyncServerConfig> = {
  ...DefaultConfig,
  ...ServerConfigDefaults,
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  port: 9010,
}

export default async function() {
  const loader = new SosusConfig<SyncServerConfig>('.sosus-api.json', DefaultApiServerConfig)
  const config = await loader.load()
  await fs.mkdirp(config.root)

  container.register(SyncServerConfigType, { useValue: config })
  container.register(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register(SystemContextConfig, { useValue: config.connections.system.couch })
  container.register(RouterType, { useValue: express() })

  container.register(RouteCollectionType, Default)

  const server = container.resolve(SyncApiServer)
  await Bootstrap(server, config)
}
