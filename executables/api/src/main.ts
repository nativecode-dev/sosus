import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { Bootstrap, ServerConfigDefaults } from '@sosus/core-web'
import { container, fs, DeepPartial, DefaultConfig } from '@sosus/core'

import { RouteCollectionType } from './Route'
import { ApiConfig } from './ApiConfig'
import { ApiServer } from './ApiServer'
import { Default, Media } from './routes'
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
  const loader = new ApiConfig('.sosus-api.json', DefaultApiServerConfig)
  const config = await loader.load(DefaultApiServerConfig)
  await fs.mkdirp(config.root)

  container.register(ApiServerConfigType, { useValue: config })
  container.register(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register(SystemContextConfig, { useValue: config.connections.system.couch })
  container.register(RouteCollectionType, Default)
  container.register(RouteCollectionType, Media)

  const server = container.resolve(ApiServer)
  await Bootstrap(server, config)
}
