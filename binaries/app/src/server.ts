import 'reflect-metadata'

import { ServerConfigDefaults } from '@sosus/core-web'
import { DeepPartial, DefaultConfig, Configuration, Logger, DefaultRedisConfig } from '@sosus/core'

import { App } from './App'
import { SapperServerConfig } from './SapperServerConfig'

const DefaultApiServerConfig: DeepPartial<SapperServerConfig> = {
  ...DefaultConfig,
  ...ServerConfigDefaults,
  api_endpoint: 'http://localhost:9000',
  port: 3000,
}

const log = Logger.extend('main')

export async function main() {
  const loader = new Configuration<SapperServerConfig>('.sosus-app.json', DefaultApiServerConfig, log)
  const app = new App(loader)
  return app.run()
}

main().catch(console.error)
