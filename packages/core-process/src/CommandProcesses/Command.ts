import { Lincoln } from '@sosus/core'

import { CommandProcess } from './CommandProcess'

export abstract class Command implements CommandProcess<any> {
  protected readonly log: Lincoln

  private cancelling = false

  readonly name: string

  constructor(name: string, logger: Lincoln) {
    this.name = name
    this.log = logger.extend(name)
    this.log.trace('created')
  }

  async cancel() {
    this.cancelling = true
  }

  protected get cancelled(): boolean {
    return this.cancelling
  }

  abstract execute(...args: any[]): Promise<any>
}

export const CommandType = Symbol('BaseCommand')
