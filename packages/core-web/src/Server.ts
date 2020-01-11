import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { Merge, DeepPartial } from '@sosus/core'

import { ServerConfig } from './ServerConfig'

export const ServerConfigDefaults: DeepPartial<ServerConfig> = {
  enableSessions: false,
  enableWebSockets: false,
}

export abstract class Server<T extends ServerConfig> {
  private readonly config: T
  private readonly express: express.Express
  private readonly http: http.Server

  constructor(config: DeepPartial<T>) {
    this.config = Merge<T>([ServerConfigDefaults as DeepPartial<T>, config])
    this.express = express()
    this.http = http.createServer(this.express)
    this.express.use(bodyParser.json())
  }

  protected get server(): http.Server {
    return this.http
  }

  protected abstract bootstrap(express: express.Express): Promise<void>

  initialize(): Promise<void> {
    try {
      return this.bootstrap(this.express)
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
