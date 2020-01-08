import { container, injectable, scoped, Lifecycle, Logger } from '@sosus/core'

import { Syncable } from './Syncable'
import { SyncProcessConstructor } from './SyncProcess'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SyncManager {
  private readonly constructors: Set<SyncProcessConstructor<Syncable>> = new Set<SyncProcessConstructor<Syncable>>()
  private readonly log = Logger.extend('sync-manager')

  register<T extends Syncable>(ctor: SyncProcessConstructor<T>) {
    this.constructors.add(ctor)
  }

  async start() {
    const promises = new Set<Promise<void>>()

    for (let ctor of this.constructors) {
      try {
        const processor = container.resolve(ctor)
        promises.add(processor.start())
      } catch (error) {
        this.log.error(ctor, error)
        throw error
      }
    }

    await Promise.all(promises.values())
  }
}
