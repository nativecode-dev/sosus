import express from 'express'

import { Application, Configuration, RunnableConstructor } from '@sosus/core'

import { RouterType } from './Route'
import { ServerConfig } from './ServerConfig'
import { ServerConfigurationType } from './Server'

export abstract class WebApplication<T extends ServerConfig> extends Application<T> {
  constructor(name: string, configuration: Configuration<T>, server: RunnableConstructor) {
    super(name, configuration, server)
  }

  protected async setup() {
    const config = await super.setup()
    const app = express()

    this.container.register<T>(ServerConfigurationType, { useValue: config })
    this.container.register<express.Express>(RouterType, { useValue: app })

    return config
  }
}
