import { RedisConfig } from '@sosus/core'
import { Connection } from '@sosus/core-data'
import { ServerConfig } from '@sosus/core-web'
import { ProcessConfig } from '@sosus/core-process'

export interface ProcessorServerConfig extends ServerConfig, ProcessConfig {
  connections: {
    media: Connection
    people: Connection
    system: Connection
  }
  redis: RedisConfig
}
