import { DeepPartial, SosusConfig } from '@sosus/core'
import { ApiServerConfig } from './ApiServerConfig'

export class ApiConfig extends SosusConfig<ApiServerConfig> {
  protected get defaults(): DeepPartial<ApiServerConfig> {
    return {}
  }
}
