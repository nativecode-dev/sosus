import { ServerConfigDefaults } from '@sosus/core-web'
import { DefaultProcessConfig } from '@sosus/core-process'
import { DeepPartial, DefaultConfig, Configuration, Logger, DefaultRedisConfig } from '@sosus/core'

import { SyncServerConfig } from './SyncServerConfig'
import { Sync } from './Sync'

const DefaultApiServerConfig: DeepPartial<SyncServerConfig> = {
  ...DefaultConfig,
  ...DefaultProcessConfig,
  ...ServerConfigDefaults,
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  port: 9010,
  redis: DefaultRedisConfig,
}

const log = Logger.extend('main')

export default async function() {
  const loader = new Configuration<SyncServerConfig>('.sosus-sync.json', DefaultApiServerConfig, log)
  const api = new Sync(loader)
  return api.run()
}
