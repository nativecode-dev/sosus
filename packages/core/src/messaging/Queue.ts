import RedisQueue from 'rsmq'

import { Merge } from '../Merge'
import { Logger } from '../Logger'
import { RedisConfig } from '../config'
import { DeepPartial } from '../DeepPartial'
import { QueueMessage } from './QueueMessage'

export abstract class Queue<T extends QueueMessage<M>, M> {
  private readonly log = Logger.extend('queue')

  private readonly queue: RedisQueue

  constructor(redis: RedisConfig) {
    this.queue = new RedisQueue(
      Merge<RedisQueue.ConstructorOptions>([redis]),
    )

    this.log.debug('created')
  }

  createQueue(qname: string, options?: RedisQueue.CreateQueueOptions) {
    return Promise.resolve(
      this.queue.createQueueAsync(
        Merge<RedisQueue.CreateQueueOptions>([{ qname }, options as DeepPartial<RedisQueue.CreateQueueOptions>]),
      ),
    )
  }

  async deleteMessage(qname: string, id: string): Promise<boolean> {
    const response = await this.queue.deleteMessageAsync({ qname, id })
    return response === 1 ? true : false
  }

  deleteQueue(qname: string) {
    return Promise.resolve(this.queue.deleteQueueAsync({ qname }))
  }

  list() {
    return this.queue.listQueuesAsync()
  }

  next(qname: string, vt: number = 120): Promise<{} | QueueMessage<M>> {
    return this.queue.receiveMessageAsync({ qname, vt })
  }

  pop(qname: string): Promise<{} | QueueMessage<M>> {
    return this.queue.popMessageAsync({ qname })
  }

  quit() {
    return this.queue.quit()
  }

  send(message: T) {
    return this.sendMessage(message.queue, JSON.stringify(message))
  }

  protected sendMessage(qname: string, message: string, delay?: number) {
    return this.queue.sendMessageAsync({ qname, message, delay })
  }
}
