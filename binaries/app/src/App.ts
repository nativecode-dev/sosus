import { WebApplication } from '@sosus/core-web'
import { ProcessConfig, ProcessConfigType } from '@sosus/core-process'
import { Configuration, DependencyContainer, RedisConfig, RedisConfigType } from '@sosus/core'

import { SapperServer } from './SapperServer'
import { SapperServerConfig } from './SapperServerConfig'

export class App extends WebApplication<SapperServerConfig> {
  constructor(configuration: Configuration<SapperServerConfig>) {
    super('', configuration, SapperServer)
  }

  protected dependencies(container: DependencyContainer, config: SapperServerConfig): void {
    container.register<ProcessConfig>(ProcessConfigType, { useValue: config })
    container.register<RedisConfig>(RedisConfigType, { useValue: config.redis })
  }
}
