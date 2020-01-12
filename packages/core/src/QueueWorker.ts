import { Worker } from 'bullmq'

import { Lincoln } from '@nofrills/scrubs'

import { QueueJob } from './QueueJob'
import { RedisConfig } from './config/RedisConfig'

export abstract class QueueWorker<T> {
  protected readonly log: Lincoln
  protected readonly worker: Worker

  constructor(readonly name: string, redis: RedisConfig, logger: Lincoln) {
    this.log = logger.extend(name)
    this.worker = new Worker(name, job => this.handle(job), { connection: redis })

    this.worker.on('completed', job => this.completed(job))
    this.worker.on('failed', (job, error) => this.failed(job, error))

    this.log.trace('create-worker', name)
  }

  protected abstract completed(job: QueueJob<T>): Promise<any>
  protected abstract failed(job: QueueJob<T>, error: Error): Promise<any>
  protected abstract handle(job: QueueJob<T>): Promise<any>
}
