import { Process } from '../Process'

export interface CommandProcess<T> extends Process {
  execute(...args: any[]): Promise<T>
}
