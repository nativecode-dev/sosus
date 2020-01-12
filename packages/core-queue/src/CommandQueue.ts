import { Queue, injectable, scoped, Lifecycle, RedisConfig, RedisConfigType, inject } from '@sosus/core'

import { Command } from './Command'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class CommandQueue extends Queue<Command> {
  constructor(@inject(RedisConfigType) redis: RedisConfig) {
    super('command-queue', redis)
  }
}
