import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { Merge } from '@sosus/core'

import { ServerConfig } from './ServerConfig'

export const ServerConfigDefaults: Partial<ServerConfig> = {
  enableSessions: false,
  enableWebSockets: false,
}

export abstract class Server<T extends ServerConfig> {
  protected readonly express: express.Express
  protected readonly http: http.Server

  constructor(protected readonly config: T) {
    const opts = Merge<ServerConfig>([ServerConfigDefaults, config])
    this.express = express()
    this.http = http.createServer(this.express)

    this.express.use(bodyParser.json())
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
