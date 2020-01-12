import { Queue } from './Queue'
import { Lincoln } from '@nofrills/scrubs'

export enum QueueState {
  running = 'running',
  stopped = 'stopped',
}

export abstract class QueueHandler<T> {
  protected readonly log: Lincoln

  private current: QueueState = QueueState.stopped

  constructor(private readonly queue: Queue<T>, logger: Lincoln) {
    this.log = logger.extend(this.queue.name)
  }

  get state() {
    return this.current
  }

  async start() {
    if (this.current === QueueState.stopped) {
      this.current = QueueState.running

      const iterator = this.createIterator()

      for await (const envelope of iterator) {
        try {
          const json = JSON.parse(envelope.message)
          await this.handle(json)
        } catch (error) {
          this.log.error(error)
        }
      }
    }
  }

  stop() {
    if (this.current === QueueState.running) {
      this.current = QueueState.stopped
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
