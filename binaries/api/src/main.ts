import { ServerConfigDefaults } from '@sosus/core-web'
import { DefaultProcessConfig } from '@sosus/core-process'
import { DeepPartial, DefaultConfig, Configuration, Logger, DefaultRedisConfig } from '@sosus/core'

import { ApiServerConfig } from './ApiServerConfig'
import { Api } from './Api'

const DefaultApiServerConfig: DeepPartial<ApiServerConfig> = {
  ...DefaultConfig,
  ...DefaultProcessConfig,
  ...ServerConfigDefaults,
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  port: 9000,
  redis: DefaultRedisConfig,
}

const log = Logger.extend('main')

export default async function() {
  const loader = new Configuration<ApiServerConfig>('.sosus-api.json', DefaultApiServerConfig, log)
  const api = new Api(loader)
  return api.run()
}
