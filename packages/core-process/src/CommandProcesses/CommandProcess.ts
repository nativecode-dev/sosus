import { Process } from '../Process'

export interface CommandProcess<T extends any> extends Process {
  execute(...args: any[]): Promise<T>
}

export const CommandProcessType = Symbol('CommandProcess')
