import { CommandExecutor } from '@sosus/core-process'

import {
  inject,
  injectable,
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
    this.log.trace('job-completed', job.id)
    return Promise.resolve()
  }

  protected failed(job: QueueJob<ICommand>, error: Error): Promise<any> {
    this.log.trace('job-failed', job.id, error)
    this.log.error(error)
    return Promise.resolve()
  }

  protected async handle(job: QueueJob<ICommand>): Promise<any> {
    this.log.trace('command-handle', job.id, job.name, job.data)
    const result = await this.executor.execute(job.data.name, job.data.parameters)
    this.log.trace('handle-result', result)
    return result
  }
}
