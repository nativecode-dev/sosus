import 'reflect-metadata'

import express from 'express'

import { registerCoreProcessDependencies } from '@sosus/core-process'
import { Bootstrap, ServerConfigDefaults, RouterType } from '@sosus/core-web'
import { container, DeepPartial, DefaultConfig, SosusConfig, Lincoln, LoggerType, Logger } from '@sosus/core'

import { SapperServer } from './SapperServer'
import { SapperServerConfig, SapperServerConfigType } from './SapperServerConfig'

const DefaultApiServerConfig: DeepPartial<SapperServerConfig> = {
  ...DefaultConfig,
  ...ServerConfigDefaults,
  api_endpoint: 'http://localhost:9000',
  port: 3000,
}

function registerConfigurations(config: SapperServerConfig) {
  container.register<SapperServerConfig>(SapperServerConfigType, { useValue: config })
}

const log = Logger.extend('main')

export async function main() {
  const loader = new SosusConfig<SapperServerConfig>('.sosus-app.json', DefaultApiServerConfig, log)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()

  console.log('registering dependencies')
  registerCoreProcessDependencies(container)
  registerConfigurations(config)

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(SapperServer)

  await loader.save()
  await Bootstrap(server, config)
}

main().catch(console.error)
