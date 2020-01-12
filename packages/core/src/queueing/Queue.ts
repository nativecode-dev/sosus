import RedisQueue from 'rsmq'

import { Merge } from '../Merge'
import { Logger } from '../Logger'
import { DeepPartial } from '../DeepPartial'
import { Envelope } from './Envelope'
import { RedisConfig } from '../config/RedisConfig'

export abstract class Queue<T> {
  readonly name: string

  private readonly log = Logger.extend('queue')

  private readonly queue: RedisQueue

  constructor(name: string, redis: RedisConfig) {
    this.queue = new RedisQueue(
      Merge<RedisQueue.ConstructorOptions>([redis]),
    )

    this.name = name

    this.log.debug('created')
  }

  createQueue(qname: string, options?: RedisQueue.CreateQueueOptions) {
    return Promise.resolve(
      this.queue.createQueueAsync(
        Merge<RedisQueue.CreateQueueOptions>([{ qname }, options as DeepPartial<RedisQueue.CreateQueueOptions>]),
      ),
    )
  }

  createMessage(message: T, source: string, target: string = '*'): Envelope {
    return Merge<Envelope>([
      {
        message: JSON.stringify(message),
        queue: this.name,
        source,
        target,
      },
    ])
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

  async next(qname: string, vt: number = 120): Promise<Envelope | undefined> {
    const message = await this.queue.receiveMessageAsync({ qname, vt })

    if (Object.keys(message).length > 0) {
      return message as Envelope
    }

    return undefined
  }

  async pop(qname: string): Promise<Envelope | undefined> {
    const message = await this.queue.popMessageAsync({ qname })

    if (Object.keys(message).length > 0) {
      return message as Envelope
    }

    return undefined
  }

  quit() {
    return this.queue.quit()
  }

  send(message: Envelope) {
    return this.sendMessage(message.queue, JSON.stringify(message))
  }

  protected sendMessage(qname: string, message: string, delay?: number) {
    return this.queue.sendMessageAsync({ qname, message, delay })
  }
}
