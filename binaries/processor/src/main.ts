import express from 'express'

import { CouchConfig } from '@sosus/core-data'
import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'
import { Bootstrap, RouterType, ServerConfigDefaults } from '@sosus/core-web'
import { DefaultProcessConfig, registerCommands, ProcessConfigType, ProcessConfig } from '@sosus/core-process'

import {
  container,
  DeepPartial,
  DefaultConfig,
  Configuration,
  NpmPackage,
  NpmPackageType,
  Logger,
  Lincoln,
  LoggerType,
  RedisConfig,
  RedisConfigType,
  DefaultRedisConfig,
} from '@sosus/core'

import { ProcessorServer } from './ProcessorServer'
import { ProcessorServerConfig, ProcessorServerConfigType } from './ProcessorServerConfig'

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

function registerConfigs(config: ProcessorServerConfig) {
  const Package = require('../package.json')
  container.register<NpmPackage>(NpmPackageType, { useValue: Package })
  container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
  container.register<ProcessorServerConfig>(ProcessorServerConfigType, { useValue: config })
  container.register<CouchConfig>(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register<CouchConfig>(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register<CouchConfig>(SystemContextConfig, { useValue: config.connections.system.couch })
  container.register<RedisConfig>(RedisConfigType, { useValue: config.redis })
}

const log = Logger.extend('main')

export default async function() {
  const loader = new Configuration<ProcessorServerConfig>('.sosus-sync.json', DefaultApiServerConfig, log)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()

  console.log('registering dependencies')
  registerCommands(container)
  registerConfigs(config)

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(ProcessorServer)

  await loader.save()
  await Bootstrap(server, config)
}
