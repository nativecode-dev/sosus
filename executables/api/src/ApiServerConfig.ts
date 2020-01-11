import { Connection } from '@sosus/core-data'
import { ServerConfig } from '@sosus/core-web'

export interface ApiServerConfig extends ServerConfig {
  connections: {
    media: Connection
    people: Connection
    system: Connection
  }
}

export const ApiServerConfigType = Symbol('ApiServerConfig')
