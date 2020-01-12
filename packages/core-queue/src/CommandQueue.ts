import { inject, injectable, Lincoln, LoggerType, Queue, RedisConfig, RedisConfigType, singleton } from '@sosus/core'

import { ICommand } from './Command'
import { CommandQueueName } from './CommandQueueName'

@injectable()
@singleton()
export class CommandQueue extends Queue<ICommand> {
  constructor(@inject(RedisConfigType) redis: RedisConfig, @inject(LoggerType) logger: Lincoln) {
    super(CommandQueueName, redis, logger)
  }
}
