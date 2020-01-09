import { container, injectable, scoped, Lifecycle, Logger, Reduced } from '@sosus/core'

import { Process } from './Process'
import { SyncableProcess } from './SyncProcesses/SyncableProcess'
import { CommandProcess } from './CommandProcesses/CommandProcess'
import { SyncProcessConstructor } from './SyncProcesses/SyncProcessConstructor'
import { CommandProcessConstructor } from './CommandProcesses/CommandProcessConstructor'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class ProcessManager {
  private readonly log = Logger.extend('sync-manager')
  private readonly commands: Map<string, CommandProcessConstructor<CommandProcess<any>>>
  private readonly syncables: Set<SyncProcessConstructor<SyncableProcess>>
  private readonly syncing: Set<Promise<Process>>

  constructor() {
    this.commands = new Map<string, CommandProcessConstructor<CommandProcess<any>>>()
    this.syncables = new Set<SyncProcessConstructor<SyncableProcess>>()
    this.syncing = new Set<Promise<Process>>()
  }

  registerCommand<T extends CommandProcess<any>>(name: string, ctor: CommandProcessConstructor<T>) {
    this.commands.set(name, ctor)
    return this
  }

  registerSyncProcess<T extends SyncableProcess>(ctor: SyncProcessConstructor<T>) {
    this.syncables.add(ctor)
    return this
  }

  async cancel() {
    const promises = Array.from(this.syncing.values()).map(async promise => {
      const process = await promise
      return process.cancel()
    })

    await Promise.all(promises)
  }

  async execute<T>(name: string): Promise<T> {
    const ctor = this.commands.get(name)

    if (ctor) {
      const command = container.resolve(ctor)
      return command.execute()
    }

    throw new Error(`constructor for ${name} not found`)
  }

  sync() {
    for (const ctor of this.syncables) {
      try {
        const processor = container.resolve(ctor)
        this.syncing.add(processor.start())
      } catch (error) {
        this.log.error(ctor, error)
        throw error
      }
    }

    const promises = Array.from(this.syncing.values())
    return Promise.all(promises)
  }
}
