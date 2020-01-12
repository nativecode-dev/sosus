import { Lincoln } from '@nofrills/scrubs'

import { Queue } from './Queue'

export enum QueueState {
  running = 'running',
  stopped = 'stopped',
}

export abstract class QueueHandler<T> {
  protected readonly log: Lincoln

  private current: QueueState = QueueState.stopped
  private promise: Promise<T> | null = null

  constructor(private readonly queue: Queue<T>, logger: Lincoln) {
    this.log = logger.extend(this.queue.name)
  }

  get state() {
    return this.current
  }

  start() {
    if (this.promise) {
      return
    }

    const iterator = this.createIterator()

    this.current = QueueState.running
    this.promise = new Promise<T>(async resolve => {
      for await (const envelope of iterator) {
        try {
          if (this.current !== QueueState.running) {
            resolve()
          }

          const json = JSON.parse(envelope.message)
          await this.handle(json)
        } catch (error) {
          this.log.error(error)
        }
      }
    })
  }

  async stop() {
    if (this.promise && this.current === QueueState.running) {
      this.current = QueueState.stopped
      const promise = this.promise
      this.promise = null
      return promise
    }
  }

  private async *createIterator() {
    while (this.current === QueueState.running) {
      try {
        const envelope = await this.queue.next(this.queue.name)

        if (envelope) {
          yield envelope
        }
      } catch (error) {
        this.log.error(error)
      }
    }
  }

  protected abstract handle(message: T): Promise<void>
}
