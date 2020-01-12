import { Connection } from '@sosus/core-data'
import { ServerConfig } from '@sosus/core-web'
import { ProcessConfig } from '@sosus/core-process'

export interface SyncServerConfig extends ServerConfig, ProcessConfig {
  connections: {
    media: Connection
    people: Connection
    system: Connection
  }
}

export const SyncServerConfigType = Symbol('SyncServerConfig')
