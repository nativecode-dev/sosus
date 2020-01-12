import express from 'express'

import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { Bootstrap, RouterType, RouteCollectionType, ServerConfigDefaults, IRoute } from '@sosus/core-web'

import {
  container,
  fs,
  DeepPartial,
  DefaultConfig,
  SosusConfig,
  NpmPackage,
  NpmPackageType,
  CouchConfig,
  Logger,
  Lincoln,
  LoggerType,
} from '@sosus/core'

import { Default } from './routes/Default'
import { SyncServer } from './SyncServer'
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

function registerConfigurations(config: SyncServerConfig) {
  const Package = require('../package.json')
  container.register<NpmPackage>(NpmPackageType, { useValue: Package })
  container.register<SyncServerConfig>(SyncServerConfigType, { useValue: config })
  container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })
}

function registerRoutes() {
  container.register<IRoute>(RouteCollectionType, Default)
}

export default async function() {
  const loader = new SosusConfig<SyncServerConfig>('.sosus-api.json', DefaultApiServerConfig)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()
  await fs.mkdirp(config.root)

  console.log('registering dependencies')
  registerConfigurations(config)
  registerRoutes()

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(SyncServer)

  await Bootstrap(server, config)
}
