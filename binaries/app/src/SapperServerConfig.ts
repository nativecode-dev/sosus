import { RedisConfig } from '@sosus/core'
import { ServerConfig } from '@sosus/core-web'
import { ProcessConfig } from '@sosus/core-process'

export interface SapperServerConfig extends ServerConfig, ProcessConfig {
  api_endpoint: string
  redis: RedisConfig
}
