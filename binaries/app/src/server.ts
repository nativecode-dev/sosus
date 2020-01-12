import 'reflect-metadata'

import express from 'express'

import { Bootstrap, ServerConfigDefaults, RouterType } from '@sosus/core-web'

import {
  container,
  DeepPartial,
  DefaultConfig,
  Configuration,
  Lincoln,
  LoggerType,
  Logger,
  DefaultRedisConfig,
} from '@sosus/core'

import { registerCommands, ProcessConfig, ProcessConfigType, DefaultProcessConfig } from '@sosus/core-process'

import { SapperServer } from './SapperServer'
import { SapperServerConfig, SapperServerConfigType } from './SapperServerConfig'

const DefaultApiServerConfig: DeepPartial<SapperServerConfig> = {
  ...DefaultConfig,
  ...DefaultProcessConfig,
  ...ServerConfigDefaults,
  api_endpoint: 'http://localhost:9000',
  port: 3000,
  redis: DefaultRedisConfig,
}

function registerConfigs(config: SapperServerConfig) {
  container.register<SapperServerConfig>(SapperServerConfigType, { useValue: config })
  container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
}

const log = Logger.extend('main')

export async function main() {
  const loader = new Configuration<SapperServerConfig>('.sosus-app.json', DefaultApiServerConfig, log)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()

  console.log('registering dependencies')
  registerCommands(container)
  registerConfigs(config)

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(SapperServer)

  await loader.save()
  await Bootstrap(server, config)
}

main().catch(console.error)
