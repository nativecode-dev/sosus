import { Server } from './Server'
import { ServerConfig } from './ServerConfig'

export interface ServerConstructor<T extends ServerConfig> {
  new (config: T): Server<T>
}
