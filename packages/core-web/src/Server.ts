import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { Merge, DeepPartial, Logger, Lincoln } from '@sosus/core'

import { ServerConfig } from './ServerConfig'

export const ServerConfigDefaults: DeepPartial<ServerConfig> = {
  enableSessions: false,
  enableWebSockets: false,
  statics: ['static'],
}

export abstract class Server<T extends ServerConfig> {
  private readonly config: T
  private readonly express: express.Express
  private readonly http: http.Server

  protected readonly log: Lincoln
  protected readonly name: string

  constructor(name: string, express: express.Express, logger: Lincoln, config: DeepPartial<T>) {
    this.name = name
    this.log = Logger.extend(name)
    this.config = Merge<T>([ServerConfigDefaults as DeepPartial<T>, config])
    this.express = express
    this.http = http.createServer(this.express)
    this.express.use(bodyParser.json())
  }

  protected get server(): http.Server {
    return this.http
  }

  protected abstract bootstrap(express: express.Express): Promise<void>

  async initialize(): Promise<void> {
    try {
      this.config.statics.map(dir => {
        this.log.debug('using static folder:', dir)
        express.static(dir)
      })

      await this.bootstrap(this.express)

      const routes = this.express._router.stack.filter((item: any) => item.route).map((item: any) => item.route.path)
      this.log.debug('routes', ...routes)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  start(port: number): Promise<void> {
    return new Promise(resolve => {
      this.http.listen(port, () => resolve())
      console.log(`listening ${this.config.machine}:${port}`)
    })
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.close(error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
