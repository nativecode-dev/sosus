import { ServerConfigDefaults } from '@sosus/core-web'
import { DefaultProcessConfig } from '@sosus/core-process'
import { DeepPartial, DefaultConfig, Configuration, Logger, DefaultRedisConfig } from '@sosus/core'

import { Processor } from './Processor'
import { ProcessorServerConfig } from './ProcessorServerConfig'

const DefaultApiServerConfig: DeepPartial<ProcessorServerConfig> = {
  ...DefaultConfig,
  ...DefaultProcessConfig,
  ...ServerConfigDefaults,
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  port: 9020,
  redis: DefaultRedisConfig,
}

const log = Logger.extend('main')

export default async function() {
  const loader = new Configuration<ProcessorServerConfig>('.sosus-process.json', DefaultApiServerConfig, log)
  const api = new Processor(loader)
  return api.run()
}
