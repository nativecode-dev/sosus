import bullmq, { Queue as QueueBase } from 'bullmq'

import { Lincoln } from '@nofrills/scrubs'

import { QueueJob } from './QueueJob'
import { RedisConfig } from './config/RedisConfig'

export class Queue<T = any, R = any> {
  readonly name: string

  protected readonly log: Lincoln
  protected readonly queue: bullmq.Queue<T>

  constructor(name: string, redis: RedisConfig, logger: Lincoln) {
    this.log = logger.extend(name)
    this.name = name

    const options = { connection: redis }
    this.log.trace('queue-options', options)
    this.queue = new QueueBase(name, options)

    this.log.debug('created', this.name)
  }

  send(message: T, delay?: number): Promise<QueueJob<T, R>> {
    const options: bullmq.JobsOptions = { delay, removeOnComplete: true, removeOnFail: true, jobId: this.name }
    return this.queue.add(this.name, message, options)
  }
}
