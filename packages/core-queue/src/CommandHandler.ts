import { CommandExecutor } from '@sosus/core-process'

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
    const result = await this.executor.execute(job.data.name, job.data.parameters)
    this.log.trace('handle-result', result)
    return result
  }
}
