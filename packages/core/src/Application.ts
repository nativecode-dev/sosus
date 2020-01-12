import { DependencyContainer, container } from 'tsyringe'

import { Config, Configuration } from './config'
import { Runnable, RunnableConstructor } from './Runnable'
import { Lincoln } from '@nofrills/scrubs'
import { LoggerType, Logger } from './Logger'

export abstract class Application<TConfig extends Config> {
  protected readonly container: DependencyContainer

  constructor(
    readonly name: string,
    readonly configuration: Configuration<TConfig>,
    private readonly server: RunnableConstructor,
  ) {
    this.container = container.createChildContainer()
  }

  async run() {
    const config = await this.setup()
    const app = await this.build()

    console.log(config)

    process.on('SIGTERM', () => process.exit())
    process.on('SIGHUP', () => process.exit())
    process.on('SIGUSR1', () => process.exit())
    process.on('SIGUSR2', () => process.exit())
    process.on('uncaughtException', async error => console.error(error))
    process.on('unhandledRejection', async error => console.error(error))

    await app.initialize()

    return app.start()
  }

  protected async build(): Promise<Runnable> {
    return this.container.resolve(this.server)
  }

  protected async setup(): Promise<TConfig> {
    const config = await this.configuration.load()

    this.container.register<Lincoln>(LoggerType, { useValue: Logger })

    this.dependencies(this.container, config)

    return config
  }

  protected abstract dependencies(container: DependencyContainer, config: TConfig): void
}
