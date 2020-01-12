import { CommandType, Command as CommandProcess } from '@sosus/core-process'
import { QueueHandler, inject, Lincoln, LoggerType, injectAll, injectable, scoped, Lifecycle } from '@sosus/core'

import { Command } from './Command'
import { CommandQueue } from './CommandQueue'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class CommandQueueHandler extends QueueHandler<Command> {
  constructor(
    @injectAll(CommandType) private readonly commands: CommandProcess[],
    @inject(LoggerType) logger: Lincoln,
    queue: CommandQueue,
  ) {
    super(queue, logger)
  }

  protected async handle(message: Command): Promise<void> {
    const command = this.commands.find(process => process.name === message.name)

    if (command) {
      const results = await command.execute(...message.parameters)
      this.log.debug(results)
    }
  }
}
