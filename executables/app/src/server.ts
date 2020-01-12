import 'reflect-metadata'

import express from 'express'

import { registerCoreProcessDependencies } from '@sosus/core-process'
import { Bootstrap, ServerConfigDefaults, RouterType } from '@sosus/core-web'

import { SapperServer } from './SapperServer'
import { SapperServerConfig, SapperServerConfigType } from './SapperServerConfig'

import {
  container,
  fs,
  DeepPartial,
  DefaultConfig,
  SosusConfig,
  NpmPackage,
  NpmPackageType,
  Lincoln,
  LoggerType,
  Logger,
} from '@sosus/core'

const DefaultApiServerConfig: DeepPartial<SapperServerConfig> = {
  ...DefaultConfig,
  ...ServerConfigDefaults,
  port: 3000,
}

function registerConfigurations(config: SapperServerConfig) {
  container.register<SapperServerConfig>(SapperServerConfigType, { useValue: config })
}

export async function main() {
  const loader = new SosusConfig<SapperServerConfig>('.sosus-app.json', DefaultApiServerConfig)
  console.log('loading configuration', loader.filename)

  const config = await loader.load()
  await fs.mkdirp(config.root)

  console.log('registering dependencies')
  registerCoreProcessDependencies(container)
  registerConfigurations(config)

  container.register<express.Express>(RouterType, { useValue: express() })
  container.register<Lincoln>(LoggerType, { useValue: Logger })

  console.log('resolving server')
  const server = container.resolve(SapperServer)

  await Bootstrap(server, config)
}

main().catch(console.error)
