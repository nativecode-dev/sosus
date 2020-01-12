import { CommandType, Command, CommandExecutor } from '@sosus/core-process'

import {
  inject,
  injectable,
  injectAll,
  singleton,
  Lincoln,
  LoggerType,
  QueueJob,
  QueueWorker,
  RedisConfig,
  RedisConfigType,
} from '@sosus/core'

import { ICommand } from './Command'
import { CommandQueueName } from './CommandQueueName'

@injectable()
@singleton()
export class CommandHandler extends QueueWorker<ICommand> {
  constructor(
    @inject(LoggerType) logger: Lincoln,
    @inject(RedisConfigType) redis: RedisConfig,
    private readonly executor: CommandExecutor,
  ) {
    super(CommandQueueName, redis, logger)
  }

  protected completed(job: QueueJob<ICommand>): Promise<any> {
    return job.remove()
  }

  protected failed(job: QueueJob<ICommand>, error: Error): Promise<any> {
    return job.moveToFailed(error, job.name)
  }

  protected async handle(job: QueueJob<ICommand>): Promise<any> {
    this.log.trace('command-handle', job.id, job.name, job.data)
    this.log.trace(this.executor.command(job.data.name))
    /*
    const command = this.commands.reduce<Command | undefined>((cmd, current) => {
      this.log.trace('command-reduce', current, cmd)

      if (current.name === job.data.name) {
        return current
      }

      return cmd
    }, undefined)

    this.log.trace(command)

    if (command) {
      this.log.trace('command-execute', job.data, command)
      const result = await command.execute(...job.data.parameters)
      this.log.trace('command-execute-result', job.data.name, result)
      return result
    }

    throw new QueueWorkerError(job.data.name, job.data.parameters)
    */
    this.log.trace('done')
  }
}
