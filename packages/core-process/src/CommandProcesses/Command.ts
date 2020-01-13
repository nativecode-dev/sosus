import { Lincoln } from '@sosus/core'

import { CommandProcess } from './CommandProcess'
import { CommandInstance } from './CommandInstance'

export abstract class Command implements CommandProcess<any>, CommandInstance {
  protected readonly log: Lincoln

  private cancelling = false

  readonly name: string

  constructor(name: string, logger: Lincoln) {
    this.name = name
    this.log = logger.extend(name)
    this.log.trace('create', `command:${this.name}`)
  }

  async cancel() {
    this.cancelling = true
    this.log.trace('cancel', this.cancelling)
  }

  protected get cancelled(): boolean {
    return this.cancelling
  }

  async execute(...args: any[]): Promise<any> {
    this.log.trace('execute', this.name, ...args)
    const result = await this.executor(...args)

    this.log.trace('execute-done', result)
    return result
  }

  protected abstract executor(...args: any[]): Promise<any>
}

export const CommandType = Symbol('CommandInstance')
