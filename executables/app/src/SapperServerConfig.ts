import { ServerConfig } from '@sosus/core-web'

export interface SapperServerConfig extends ServerConfig {
  api_endpoint: string
}

export const SapperServerConfigType = Symbol('SapperServerConfig')
