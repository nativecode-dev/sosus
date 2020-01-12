import express from 'express'

import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { registerCoreProcessDependencies } from '@sosus/core-process'
import { Bootstrap, ServerConfigDefaults, RouteCollectionType, RouterType, IRoute } from '@sosus/core-web'

import { ApiServer } from './ApiServer'
import { ApiServerConfig, ApiServerConfigType } from './ApiServerConfig'

import { Default } from './routes/Default'
import { Movies } from './routes/Movies'
import { People } from './routes/People'
import { Series } from './routes/Series'

import {
  container,
  DeepPartial,
  DefaultConfig,
  SosusConfig,
  CouchConfig,
  NpmPackage,
  NpmPackageType,
  Lincoln,
  LoggerType,
  Logger,
} from '@sosus/core'

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

function registerConfigs(config: ApiServerConfig) {
  const Package = require('../package.json')
  container.register<NpmPackage>(NpmPackageType, { useValue: Package })
  container.register<ApiServerConfig>(ApiServerConfigType, { useValue: config })
  container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })
}

function registerRoutes() {
  container.register<IRoute>(RouteCollectionType, Default)
  container.register<IRoute>(RouteCollectionType, Movies)
  container.register<IRoute>(RouteCollectionType, People)
  container.register<IRoute>(RouteCollectionType, Series)
}

const log = Logger.extend('main')

export default async function() {
  log.trace('DefaultApiServerConfig', DefaultApiServerConfig)
  const loader = new SosusConfig<ApiServerConfig>('.sosus-api.json', DefaultApiServerConfig, log)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()
  log.trace('config', config)

  console.log('registering dependencies')
  registerCoreProcessDependencies(container)
  registerConfigs(config)
  registerRoutes()

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(ApiServer)

  await Bootstrap(server, config)
}
