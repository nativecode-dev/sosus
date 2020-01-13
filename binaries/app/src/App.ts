import { WebApplication } from '@sosus/core-web'
import { Configuration, DependencyContainer } from '@sosus/core'

import { SapperServer } from './SapperServer'
import { SapperServerConfig } from './SapperServerConfig'

export class App extends WebApplication<SapperServerConfig> {
  constructor(configuration: Configuration<SapperServerConfig>) {
    super('app', configuration, SapperServer)
  }

  protected dependencies(container: DependencyContainer, config: SapperServerConfig): void {
    return
  }
}
