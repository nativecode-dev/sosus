import { Config } from '@sosus/core'

export interface ServerConfig extends Config {
  enableSessions: boolean
  enableWebSockets: boolean
  statics: string[]
}

export const ServerConfigType = Symbol('ServerConfig')
